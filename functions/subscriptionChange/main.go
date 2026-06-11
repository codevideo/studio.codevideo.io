package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"codevideo-functions/internal/billing"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/user"
	stripe "github.com/stripe/stripe-go/v81"
	"github.com/stripe/stripe-go/v81/customer"
)

func handler(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if req.HTTPMethod != "POST" {
		return events.APIGatewayProxyResponse{StatusCode: http.StatusMethodNotAllowed, Body: "Method Not Allowed"}, nil
	}

	eventData, err := billing.ParseStripeEvent(req.Body)
	if err != nil {
		log.Printf("Error parsing webhook event: %v", err)
		billing.Notify("CodeVideo billing webhook parse failed", map[string]string{"error": err.Error()})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest, Body: "Bad Request"}, nil
	}

	switch eventData.Type {
	case "customer.subscription.created", "customer.subscription.updated":
		return handleSubscriptionEvent(eventData), nil
	case "invoice.paid":
		return handleInvoicePaidEvent(eventData), nil
	default:
		billing.Notify("CodeVideo billing webhook ignored", map[string]string{"event": eventData.Type, "reason": "unsupported event type"})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: "Ignored"}, nil
	}
}

func handleSubscriptionEvent(eventData billing.StripeEvent) events.APIGatewayProxyResponse {
	sub, err := billing.ParseSubscription(eventData.Data.Object)
	if err != nil {
		log.Printf("Error parsing subscription object: %v", err)
		billing.Notify("CodeVideo subscription webhook parse failed", map[string]string{"event": eventData.Type, "error": err.Error()})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest, Body: "Bad Request"}
	}

	priceID := billing.FirstSubscriptionPriceID(sub)
	billing.Notify("CodeVideo subscription webhook received", map[string]string{
		"event":           eventData.Type,
		"subscription_id": sub.ID,
		"customer_id":     sub.Customer.ID,
		"price_id":        priceID,
		"status":          sub.Status,
	})

	if priceID == "" {
		billing.Notify("CodeVideo subscription webhook failed", map[string]string{
			"event":           eventData.Type,
			"subscription_id": sub.ID,
			"reason":          "no subscription items or price ID",
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest, Body: "No subscription items"}
	}

	priceIDToPlan, missingEnv := billing.PriceIDToPlanFromEnv()
	notifyMissingPriceEnv(missingEnv)
	plan, ok := priceIDToPlan[priceID]
	if !ok {
		billing.Notify("CodeVideo subscription webhook ignored", map[string]string{
			"event":           eventData.Type,
			"subscription_id": sub.ID,
			"customer_id":     sub.Customer.ID,
			"price_id":        priceID,
			"reason":          "unrecognized price ID",
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: "Ignored"}
	}

	customerEmail, err := resolveCustomerEmail(sub.CustomerEmail, sub.Customer.ID)
	if err != nil {
		billing.Notify("CodeVideo subscription webhook failed", map[string]string{
			"event":           eventData.Type,
			"subscription_id": sub.ID,
			"customer_id":     sub.Customer.ID,
			"price_id":        priceID,
			"reason":          err.Error(),
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Error retrieving customer"}
	}
	if customerEmail == "" {
		billing.Notify("CodeVideo subscription webhook failed", map[string]string{
			"event":           eventData.Type,
			"subscription_id": sub.ID,
			"customer_id":     sub.Customer.ID,
			"price_id":        priceID,
			"reason":          "no customer email",
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest, Body: "No customer email"}
	}

	clerkUser, err := findClerkUserByEmail(customerEmail)
	if err != nil {
		billing.Notify("CodeVideo subscription Clerk lookup failed", map[string]string{
			"event":           eventData.Type,
			"subscription_id": sub.ID,
			"email":           customerEmail,
			"price_id":        priceID,
			"error":           err.Error(),
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Error finding user"}
	}
	billing.Notify("CodeVideo subscription Clerk lookup succeeded", map[string]string{
		"event":           eventData.Type,
		"subscription_id": sub.ID,
		"clerk_user_id":   clerkUser.ID,
		"email":           customerEmail,
		"price_id":        priceID,
	})

	publicMeta := billing.MetadataMap(clerkUser.PublicMetadata)
	privateMeta := billing.MetadataMap(clerkUser.PrivateMetadata)
	publicMeta = billing.ApplySubscriptionMetadata(publicMeta, plan, sub.Status, sub.Customer.ID, sub.ID, priceID)

	grantKey := ""
	granted := false
	if eventData.Type == "customer.subscription.created" && sub.Status == "active" {
		grantKey = billing.InitialSubscriptionGrantKey(sub.ID)
		publicMeta, privateMeta, granted = billing.ApplyGrant(publicMeta, privateMeta, grantKey, plan.TokensPerCycle)
	}

	if err := updateClerkMetadata(clerkUser.ID, publicMeta, privateMeta); err != nil {
		billing.Notify("CodeVideo subscription metadata update failed", map[string]string{
			"event":           eventData.Type,
			"subscription_id": sub.ID,
			"clerk_user_id":   clerkUser.ID,
			"email":           customerEmail,
			"plan":            plan.Product,
			"grant_key":       grantKey,
			"error":           err.Error(),
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Error updating metadata"}
	}

	billing.Notify("CodeVideo subscription fulfilled", map[string]string{
		"event":           eventData.Type,
		"subscription_id": sub.ID,
		"clerk_user_id":   clerkUser.ID,
		"email":           customerEmail,
		"plan":            plan.Product,
		"price_id":        priceID,
		"tokens_added":    strconv.FormatBool(granted),
		"grant_key":       grantKey,
	})

	return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: "Subscription metadata updated"}
}

func handleInvoicePaidEvent(eventData billing.StripeEvent) events.APIGatewayProxyResponse {
	invoice, err := billing.ParseInvoice(eventData.Data.Object)
	if err != nil {
		log.Printf("Error parsing invoice object: %v", err)
		billing.Notify("CodeVideo invoice webhook parse failed", map[string]string{"event": eventData.Type, "error": err.Error()})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest, Body: "Bad Request"}
	}

	priceID := billing.FirstInvoicePriceID(invoice)
	billing.Notify("CodeVideo invoice webhook received", map[string]string{
		"event":           eventData.Type,
		"invoice_id":      invoice.ID,
		"subscription_id": invoice.Subscription.ID,
		"customer_id":     invoice.Customer.ID,
		"price_id":        priceID,
		"billing_reason":  invoice.BillingReason,
		"status":          invoice.Status,
	})

	if !invoice.Paid && invoice.Status != "paid" {
		billing.Notify("CodeVideo invoice webhook ignored", map[string]string{
			"event":      eventData.Type,
			"invoice_id": invoice.ID,
			"reason":     "invoice is not paid",
			"status":     invoice.Status,
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: "Ignored"}
	}
	if priceID == "" {
		billing.Notify("CodeVideo invoice webhook failed", map[string]string{
			"event":      eventData.Type,
			"invoice_id": invoice.ID,
			"reason":     "no invoice line price ID",
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest, Body: "No invoice line price"}
	}

	priceIDToPlan, missingEnv := billing.PriceIDToPlanFromEnv()
	notifyMissingPriceEnv(missingEnv)
	plan, ok := priceIDToPlan[priceID]
	if !ok {
		billing.Notify("CodeVideo invoice webhook ignored", map[string]string{
			"event":       eventData.Type,
			"invoice_id":  invoice.ID,
			"customer_id": invoice.Customer.ID,
			"price_id":    priceID,
			"reason":      "unrecognized price ID",
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: "Ignored"}
	}

	customerEmail, err := resolveCustomerEmail(invoice.CustomerEmail, invoice.Customer.ID)
	if err != nil {
		billing.Notify("CodeVideo invoice webhook failed", map[string]string{
			"event":       eventData.Type,
			"invoice_id":  invoice.ID,
			"customer_id": invoice.Customer.ID,
			"price_id":    priceID,
			"reason":      err.Error(),
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Error retrieving customer"}
	}
	if customerEmail == "" {
		billing.Notify("CodeVideo invoice webhook failed", map[string]string{
			"event":       eventData.Type,
			"invoice_id":  invoice.ID,
			"customer_id": invoice.Customer.ID,
			"price_id":    priceID,
			"reason":      "no customer email",
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest, Body: "No customer email"}
	}

	clerkUser, err := findClerkUserByEmail(customerEmail)
	if err != nil {
		billing.Notify("CodeVideo invoice Clerk lookup failed", map[string]string{
			"event":      eventData.Type,
			"invoice_id": invoice.ID,
			"email":      customerEmail,
			"price_id":   priceID,
			"error":      err.Error(),
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Error finding user"}
	}
	billing.Notify("CodeVideo invoice Clerk lookup succeeded", map[string]string{
		"event":         eventData.Type,
		"invoice_id":    invoice.ID,
		"clerk_user_id": clerkUser.ID,
		"email":         customerEmail,
		"price_id":      priceID,
	})

	publicMeta := billing.MetadataMap(clerkUser.PublicMetadata)
	privateMeta := billing.MetadataMap(clerkUser.PrivateMetadata)
	publicMeta = billing.ApplySubscriptionMetadata(publicMeta, plan, "active", invoice.Customer.ID, invoice.Subscription.ID, priceID)
	publicMeta["lastStripeInvoiceId"] = invoice.ID

	grantKey := billing.InvoiceGrantKey(invoice.ID, invoice.Subscription.ID, invoice.BillingReason)
	publicMeta, privateMeta, granted := billing.ApplyGrant(publicMeta, privateMeta, grantKey, plan.TokensPerCycle)

	if err := updateClerkMetadata(clerkUser.ID, publicMeta, privateMeta); err != nil {
		billing.Notify("CodeVideo invoice metadata update failed", map[string]string{
			"event":         eventData.Type,
			"invoice_id":    invoice.ID,
			"clerk_user_id": clerkUser.ID,
			"email":         customerEmail,
			"plan":          plan.Product,
			"grant_key":     grantKey,
			"error":         err.Error(),
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Error updating metadata"}
	}

	billing.Notify("CodeVideo invoice fulfilled", map[string]string{
		"event":           eventData.Type,
		"invoice_id":      invoice.ID,
		"subscription_id": invoice.Subscription.ID,
		"clerk_user_id":   clerkUser.ID,
		"email":           customerEmail,
		"plan":            plan.Product,
		"price_id":        priceID,
		"tokens_added":    strconv.FormatBool(granted),
		"grant_key":       grantKey,
	})

	return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: "Invoice metadata updated"}
}

func resolveCustomerEmail(eventEmail string, customerID string) (string, error) {
	if strings.TrimSpace(eventEmail) != "" {
		return eventEmail, nil
	}
	if customerID == "" {
		return "", nil
	}

	stripeKey := os.Getenv("STRIPE_SECRET_KEY")
	if stripeKey == "" {
		return "", errMissingStripeKey()
	}
	stripe.Key = stripeKey

	cust, err := customer.Get(customerID, nil)
	if err != nil {
		return "", err
	}
	return cust.Email, nil
}

func findClerkUserByEmail(email string) (*clerk.User, error) {
	apiKey := os.Getenv("CLERK_SECRET_KEY")
	if apiKey == "" {
		return nil, errMissingClerkKey()
	}
	config := &clerk.ClientConfig{}
	config.Key = &apiKey
	client := user.NewClient(config)

	userList, err := client.List(context.Background(), &user.ListParams{EmailAddresses: []string{email}})
	if err != nil {
		return nil, err
	}
	if len(userList.Users) == 0 {
		return nil, errClerkUserNotFound(email)
	}
	return userList.Users[0], nil
}

func updateClerkMetadata(clerkUserID string, publicMeta map[string]interface{}, privateMeta map[string]interface{}) error {
	apiKey := os.Getenv("CLERK_SECRET_KEY")
	if apiKey == "" {
		return errMissingClerkKey()
	}
	config := &clerk.ClientConfig{}
	config.Key = &apiKey
	client := user.NewClient(config)

	publicRaw, err := billing.MarshalRaw(publicMeta)
	if err != nil {
		return err
	}
	privateRaw, err := billing.MarshalRaw(privateMeta)
	if err != nil {
		return err
	}

	_, err = client.UpdateMetadata(context.Background(), clerkUserID, &user.UpdateMetadataParams{
		PublicMetadata:  publicRaw,
		PrivateMetadata: privateRaw,
	})
	return err
}

func notifyMissingPriceEnv(missingEnv []string) {
	if len(missingEnv) == 0 {
		return
	}
	billing.Notify("CodeVideo billing price config incomplete", map[string]string{
		"missing_env": strings.Join(missingEnv, ", "),
	})
}

func errMissingStripeKey() error {
	return simpleError("STRIPE_SECRET_KEY not set")
}

func errMissingClerkKey() error {
	return simpleError("CLERK_SECRET_KEY not set")
}

func errClerkUserNotFound(email string) error {
	return simpleError("no Clerk user found for " + email)
}

type simpleError string

func (e simpleError) Error() string {
	return string(e)
}

func main() {
	lambda.Start(handler)
}
