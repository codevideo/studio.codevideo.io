package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"

	"codevideo-functions/internal/billing"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/user"
	stripe "github.com/stripe/stripe-go/v81"
	stripeSession "github.com/stripe/stripe-go/v81/checkout/session"
	stripeCustomer "github.com/stripe/stripe-go/v81/customer"
)

const TopupTokensPerItem = 10

type StripeSuccessRequest struct {
	StripeSessionId string `json:"stripeSessionId"`
	Product         string `json:"product"`
}

type ResponseData struct {
	Success      bool   `json:"success"`
	Email        string `json:"email,omitempty"`
	TempPassword string `json:"tempPassword,omitempty"`
}

func generateTempPassword() string {
	b := make([]byte, 8)
	if _, err := rand.Read(b); err != nil {
		log.Printf("Error generating random bytes: %v", err)
		return "codevideo_default"
	}
	return "codevideo_" + hex.EncodeToString(b)
}

func handler(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if req.HTTPMethod != "POST" {
		return events.APIGatewayProxyResponse{StatusCode: http.StatusMethodNotAllowed, Body: "Method Not Allowed"}, nil
	}

	var payload StripeSuccessRequest
	if err := json.Unmarshal([]byte(req.Body), &payload); err != nil {
		log.Printf("Error parsing request: %v", err)
		billing.Notify("CodeVideo stripeSuccess parse failed", map[string]string{"error": err.Error()})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest, Body: "Bad Request"}, nil
	}

	billing.Notify("CodeVideo stripeSuccess received", map[string]string{
		"checkout_session_id": payload.StripeSessionId,
		"product":             payload.Product,
	})

	stripeKey := os.Getenv("STRIPE_SECRET_KEY")
	if stripeKey == "" {
		log.Println("STRIPE_SECRET_KEY not set")
		billing.Notify("CodeVideo stripeSuccess failed", map[string]string{
			"checkout_session_id": payload.StripeSessionId,
			"product":             payload.Product,
			"reason":              "STRIPE_SECRET_KEY not set",
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Server Error"}, nil
	}
	stripe.Key = stripeKey

	session, err := stripeSession.Get(payload.StripeSessionId, nil)
	if err != nil {
		log.Printf("Error retrieving stripe session: %v", err)
		billing.Notify("CodeVideo stripeSuccess failed", map[string]string{
			"checkout_session_id": payload.StripeSessionId,
			"product":             payload.Product,
			"reason":              "error retrieving Stripe session",
			"error":               err.Error(),
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Error retrieving stripe session"}, nil
	}

	customerEmail, err := customerEmailFromSession(session)
	if err != nil {
		billing.Notify("CodeVideo stripeSuccess failed", map[string]string{
			"checkout_session_id": payload.StripeSessionId,
			"product":             payload.Product,
			"reason":              "error retrieving customer email",
			"error":               err.Error(),
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Error retrieving customer"}, nil
	}
	if customerEmail == "" {
		billing.Notify("CodeVideo stripeSuccess failed", map[string]string{
			"checkout_session_id": payload.StripeSessionId,
			"product":             payload.Product,
			"reason":              "no customer email",
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest, Body: "No customer email found"}, nil
	}

	client, err := clerkUserClient()
	if err != nil {
		billing.Notify("CodeVideo stripeSuccess failed", map[string]string{
			"checkout_session_id": payload.StripeSessionId,
			"email":               customerEmail,
			"product":             payload.Product,
			"reason":              err.Error(),
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Server Error"}, nil
	}

	clerkUserID, newUserCreated, tempPassword, err := findOrCreateClerkUser(client, customerEmail)
	if err != nil {
		log.Printf("Error finding or creating Clerk user: %v", err)
		billing.Notify("CodeVideo stripeSuccess failed", map[string]string{
			"checkout_session_id": payload.StripeSessionId,
			"email":               customerEmail,
			"product":             payload.Product,
			"reason":              "error finding or creating Clerk user",
			"error":               err.Error(),
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Error creating user"}, nil
	}

	clerkUser, err := client.Get(context.Background(), clerkUserID)
	if err != nil {
		log.Printf("Error fetching user: %v", err)
		billing.Notify("CodeVideo stripeSuccess failed", map[string]string{
			"checkout_session_id": payload.StripeSessionId,
			"email":               customerEmail,
			"product":             payload.Product,
			"clerk_user_id":       clerkUserID,
			"reason":              "error fetching Clerk user",
			"error":               err.Error(),
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Error fetching user"}, nil
	}

	publicMeta := billing.MetadataMap(clerkUser.PublicMetadata)
	privateMeta := billing.MetadataMap(clerkUser.PrivateMetadata)
	publicMeta["stripeId"] = payload.StripeSessionId

	grantKey := ""
	tokensAdded := false
	priceID := ""
	switch payload.Product {
	case "starter", "creator", "enterprise":
		plan, ok := billing.PlanByProduct(payload.Product)
		if !ok {
			return unknownProductResponse(payload)
		}
		priceID = firstLineItemPriceID(payload.StripeSessionId)
		publicMeta = billing.ApplySubscriptionMetadata(publicMeta, plan, "active", customerIDFromSession(session), subscriptionIDFromSession(session), priceID)
		grantKey = billing.CheckoutGrantKey(payload.StripeSessionId, subscriptionIDFromSession(session), invoiceIDFromSession(session))
		publicMeta, privateMeta, tokensAdded = billing.ApplyGrant(publicMeta, privateMeta, grantKey, plan.TokensPerCycle)
	case "topup":
		tokensToAdd, err := topupTokens(payload.StripeSessionId)
		if err != nil {
			log.Printf("Error retrieving line items: %v", err)
			billing.Notify("CodeVideo stripeSuccess failed", map[string]string{
				"checkout_session_id": payload.StripeSessionId,
				"email":               customerEmail,
				"product":             payload.Product,
				"clerk_user_id":       clerkUserID,
				"reason":              "error retrieving Stripe line items",
				"error":               err.Error(),
			})
			return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Error retrieving stripe line items"}, nil
		}
		grantKey = billing.CheckoutGrantKey(payload.StripeSessionId, "", "")
		publicMeta, privateMeta, tokensAdded = billing.ApplyGrant(publicMeta, privateMeta, grantKey, tokensToAdd)
	case "lifetime":
		publicMeta["subscriptionPlan"] = "lifetime"
		publicMeta["subscriptionStatus"] = "active"
		publicMeta["unlimited"] = true
	default:
		return unknownProductResponse(payload)
	}

	publicRaw, err := billing.MarshalRaw(publicMeta)
	if err != nil {
		log.Printf("Error marshaling public metadata: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Server Error"}, nil
	}
	privateRaw, err := billing.MarshalRaw(privateMeta)
	if err != nil {
		log.Printf("Error marshaling private metadata: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Server Error"}, nil
	}

	if _, err := client.UpdateMetadata(context.Background(), clerkUserID, &user.UpdateMetadataParams{
		PublicMetadata:  publicRaw,
		PrivateMetadata: privateRaw,
	}); err != nil {
		log.Printf("Error updating metadata: %v", err)
		billing.Notify("CodeVideo stripeSuccess metadata update failed", map[string]string{
			"checkout_session_id": payload.StripeSessionId,
			"email":               customerEmail,
			"product":             payload.Product,
			"clerk_user_id":       clerkUserID,
			"grant_key":           grantKey,
			"error":               err.Error(),
		})
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Error updating metadata"}, nil
	}

	billing.Notify("CodeVideo stripeSuccess fulfilled", map[string]string{
		"checkout_session_id": payload.StripeSessionId,
		"email":               customerEmail,
		"product":             payload.Product,
		"clerk_user_id":       clerkUserID,
		"new_user":            strconv.FormatBool(newUserCreated),
		"tokens_added":        strconv.FormatBool(tokensAdded),
		"grant_key":           grantKey,
		"price_id":            priceID,
	})

	respData := ResponseData{Success: true}
	if newUserCreated {
		respData.Email = customerEmail
		respData.TempPassword = tempPassword
	}

	respJSON, err := json.Marshal(respData)
	if err != nil {
		log.Printf("Error marshaling response: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Server Error"}, nil
	}

	return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: string(respJSON)}, nil
}

func clerkUserClient() (*user.Client, error) {
	apiKey := os.Getenv("CLERK_SECRET_KEY")
	if apiKey == "" {
		log.Println("CLERK_SECRET_KEY not set")
		return nil, simpleError("CLERK_SECRET_KEY not set")
	}
	config := &clerk.ClientConfig{}
	config.Key = &apiKey
	return user.NewClient(config), nil
}

func findOrCreateClerkUser(client *user.Client, email string) (string, bool, string, error) {
	users, err := client.List(context.Background(), &user.ListParams{EmailAddresses: []string{email}})
	if err != nil {
		return "", false, "", err
	}
	if users.TotalCount > 0 {
		return users.Users[0].ID, false, "", nil
	}

	tempPassword := generateTempPassword()
	newUser, err := client.Create(context.Background(), &user.CreateParams{
		EmailAddresses: &[]string{email},
		Password:       &tempPassword,
	})
	if err != nil {
		return "", false, "", err
	}
	return newUser.ID, true, tempPassword, nil
}

func customerEmailFromSession(session *stripe.CheckoutSession) (string, error) {
	if session.CustomerDetails != nil && session.CustomerDetails.Email != "" {
		return session.CustomerDetails.Email, nil
	}
	if session.CustomerEmail != "" {
		return session.CustomerEmail, nil
	}
	if session.Customer != nil {
		if session.Customer.Email != "" {
			return session.Customer.Email, nil
		}
		if session.Customer.ID != "" {
			cust, err := stripeCustomer.Get(session.Customer.ID, nil)
			if err != nil {
				return "", err
			}
			return cust.Email, nil
		}
	}
	return "", nil
}

func customerIDFromSession(session *stripe.CheckoutSession) string {
	if session.Customer == nil {
		return ""
	}
	return session.Customer.ID
}

func subscriptionIDFromSession(session *stripe.CheckoutSession) string {
	if session.Subscription == nil {
		return ""
	}
	return session.Subscription.ID
}

func invoiceIDFromSession(session *stripe.CheckoutSession) string {
	if session.Invoice == nil {
		return ""
	}
	return session.Invoice.ID
}

func topupTokens(stripeSessionID string) (int, error) {
	params := &stripe.CheckoutSessionListLineItemsParams{Session: stripe.String(stripeSessionID)}
	iter := stripeSession.ListLineItems(params)
	totalQuantity := 0
	for iter.Next() {
		if lineItem, ok := iter.Current().(*stripe.LineItem); ok {
			totalQuantity += int(lineItem.Quantity)
		}
	}
	if err := iter.Err(); err != nil {
		return 0, err
	}
	return totalQuantity * TopupTokensPerItem, nil
}

func firstLineItemPriceID(stripeSessionID string) string {
	params := &stripe.CheckoutSessionListLineItemsParams{Session: stripe.String(stripeSessionID)}
	iter := stripeSession.ListLineItems(params)
	for iter.Next() {
		if lineItem, ok := iter.Current().(*stripe.LineItem); ok && lineItem.Price != nil {
			return lineItem.Price.ID
		}
	}
	if err := iter.Err(); err != nil {
		log.Printf("Error retrieving stripe line item price: %v", err)
	}
	return ""
}

func unknownProductResponse(payload StripeSuccessRequest) (events.APIGatewayProxyResponse, error) {
	billing.Notify("CodeVideo stripeSuccess ignored", map[string]string{
		"checkout_session_id": payload.StripeSessionId,
		"product":             payload.Product,
		"reason":              "unknown product type",
	})
	return events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest, Body: "Unknown product type"}, nil
}

type simpleError string

func (e simpleError) Error() string {
	return string(e)
}

func main() {
	lambda.Start(handler)
}
