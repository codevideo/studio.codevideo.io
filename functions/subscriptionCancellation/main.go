package main

import (
	"context"
	"log"
	"net/http"
	"os"
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
		billing.Notify("CodeVideo cancellation webhook parse failed", map[string]string{"error": err.Error()})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest, Body: "Bad Request"}, nil
	}

	if eventData.Type != "customer.subscription.deleted" {
		billing.Notify("CodeVideo cancellation webhook ignored", map[string]string{"event": eventData.Type, "reason": "unsupported event type"})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: "Ignored"}, nil
	}

	sub, err := billing.ParseSubscription(eventData.Data.Object)
	if err != nil {
		log.Printf("Error parsing subscription object: %v", err)
		billing.Notify("CodeVideo cancellation webhook parse failed", map[string]string{"event": eventData.Type, "error": err.Error()})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest, Body: "Bad Request"}, nil
	}

	priceID := billing.FirstSubscriptionPriceID(sub)
	billing.Notify("CodeVideo cancellation webhook received", map[string]string{
		"event":           eventData.Type,
		"subscription_id": sub.ID,
		"customer_id":     sub.Customer.ID,
		"price_id":        priceID,
		"status":          sub.Status,
	})

	if priceID == "" {
		billing.Notify("CodeVideo cancellation webhook failed", map[string]string{
			"event":           eventData.Type,
			"subscription_id": sub.ID,
			"reason":          "no subscription items or price ID",
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest, Body: "No subscription items"}, nil
	}

	priceIDToPlan, missingEnv := billing.PriceIDToPlanFromEnv()
	notifyMissingPriceEnv(missingEnv)
	plan, ok := priceIDToPlan[priceID]
	if !ok {
		billing.Notify("CodeVideo cancellation webhook ignored", map[string]string{
			"event":           eventData.Type,
			"subscription_id": sub.ID,
			"customer_id":     sub.Customer.ID,
			"price_id":        priceID,
			"reason":          "unrecognized price ID",
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: "Ignored"}, nil
	}

	customerEmail, err := resolveCustomerEmail(sub.CustomerEmail, sub.Customer.ID)
	if err != nil {
		billing.Notify("CodeVideo cancellation webhook failed", map[string]string{
			"event":           eventData.Type,
			"subscription_id": sub.ID,
			"customer_id":     sub.Customer.ID,
			"price_id":        priceID,
			"reason":          err.Error(),
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Error retrieving customer"}, nil
	}
	if customerEmail == "" {
		billing.Notify("CodeVideo cancellation webhook failed", map[string]string{
			"event":           eventData.Type,
			"subscription_id": sub.ID,
			"customer_id":     sub.Customer.ID,
			"price_id":        priceID,
			"reason":          "no customer email",
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest, Body: "No customer email"}, nil
	}

	clerkUser, err := findClerkUserByEmail(customerEmail)
	if err != nil {
		billing.Notify("CodeVideo cancellation Clerk lookup failed", map[string]string{
			"event":           eventData.Type,
			"subscription_id": sub.ID,
			"email":           customerEmail,
			"price_id":        priceID,
			"error":           err.Error(),
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Error finding user"}, nil
	}
	billing.Notify("CodeVideo cancellation Clerk lookup succeeded", map[string]string{
		"event":           eventData.Type,
		"subscription_id": sub.ID,
		"clerk_user_id":   clerkUser.ID,
		"email":           customerEmail,
		"price_id":        priceID,
	})

	publicMeta := billing.MetadataMap(clerkUser.PublicMetadata)
	privateMeta := billing.MetadataMap(clerkUser.PrivateMetadata)
	publicMeta = billing.ApplyCancellationMetadata(publicMeta, sub.Customer.ID, sub.ID, priceID)

	if err := updateClerkMetadata(clerkUser.ID, publicMeta, privateMeta); err != nil {
		billing.Notify("CodeVideo cancellation metadata update failed", map[string]string{
			"event":           eventData.Type,
			"subscription_id": sub.ID,
			"clerk_user_id":   clerkUser.ID,
			"email":           customerEmail,
			"plan":            plan.Product,
			"error":           err.Error(),
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Error updating metadata"}, nil
	}

	billing.Notify("CodeVideo subscription canceled", map[string]string{
		"event":           eventData.Type,
		"subscription_id": sub.ID,
		"clerk_user_id":   clerkUser.ID,
		"email":           customerEmail,
		"plan":            plan.Product,
		"price_id":        priceID,
	})

	return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: "Cancellation processed and metadata updated"}, nil
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
		return "", simpleError("STRIPE_SECRET_KEY not set")
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
		return nil, simpleError("CLERK_SECRET_KEY not set")
	}
	config := &clerk.ClientConfig{}
	config.Key = &apiKey
	client := user.NewClient(config)

	userList, err := client.List(context.Background(), &user.ListParams{EmailAddresses: []string{email}})
	if err != nil {
		return nil, err
	}
	if len(userList.Users) == 0 {
		return nil, simpleError("no Clerk user found for " + email)
	}
	return userList.Users[0], nil
}

func updateClerkMetadata(clerkUserID string, publicMeta map[string]interface{}, privateMeta map[string]interface{}) error {
	apiKey := os.Getenv("CLERK_SECRET_KEY")
	if apiKey == "" {
		return simpleError("CLERK_SECRET_KEY not set")
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

type simpleError string

func (e simpleError) Error() string {
	return string(e)
}

func main() {
	lambda.Start(handler)
}
