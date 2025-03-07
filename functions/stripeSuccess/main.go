package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"

	stripe "github.com/stripe/stripe-go/v81"
	stripeSession "github.com/stripe/stripe-go/v81/checkout/session"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/user"
)

// StripeSuccessRequest is the payload expected from the client.
type StripeSuccessRequest struct {
	ClerkUserId     string `json:"clerkUserId"`
	StripeSessionId string `json:"stripeSessionId"`
	Product         string `json:"product"` // e.g. "starter", "creator", "enterprise", "topup", "lifetime"
}

// Hardcoded configuration for each product.
const (
	StarterTokens      = 50
	CreatorTokens      = 500
	EnterpriseTokens   = 10000
	TopupTokensPerItem = 10
)

func handler(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Allow only POST requests.
	if req.HTTPMethod != "POST" {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusMethodNotAllowed,
			Body:       "Method Not Allowed",
		}, nil
	}

	var payload StripeSuccessRequest
	if err := json.Unmarshal([]byte(req.Body), &payload); err != nil {
		log.Printf("Error parsing request: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Body:       "Bad Request",
		}, nil
	}

	apiKey := os.Getenv("CLERK_API_KEY")
	if apiKey == "" {
		log.Println("CLERK_API_KEY not set")
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       "Server Error",
		}, nil
	}
	config := &clerk.ClientConfig{}
	config.Key = &apiKey
	client := user.NewClient(config)

	// Fetch the current clerkUser so we can add to the existing credits.
	clerkUser, err := client.Get(context.Background(), payload.ClerkUserId)
	if err != nil {
		log.Printf("Error fetching user: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       "Error fetching user",
		}, nil
	}

	// Retrieve current credits from public metadata (default to 0 if not set).
	currentCredits := 0
	if clerkUser.PublicMetadata != nil {
		var meta map[string]interface{}
		if err := json.Unmarshal(clerkUser.PublicMetadata, &meta); err == nil {
			if creditsVal, ok := meta["credits"]; ok {
				switch v := creditsVal.(type) {
				case float64:
					currentCredits = int(v)
				case string:
					if i, err := strconv.Atoi(v); err == nil {
						currentCredits = i
					}
				}
			}
		}
	}

	// Prepare new metadata changes.
	newMetadata := make(map[string]interface{})
	// Always update the stripeId.
	newMetadata["stripeId"] = payload.StripeSessionId

	switch payload.Product {
	case "starter":
		newMetadata["subscriptionPlan"] = "starter"
		newMetadata["subscriptionStatus"] = "active"
		newMetadata["creditsPerCycle"] = StarterTokens
		newMetadata["credits"] = currentCredits + StarterTokens
	case "creator":
		newMetadata["subscriptionPlan"] = "creator"
		newMetadata["subscriptionStatus"] = "active"
		newMetadata["creditsPerCycle"] = CreatorTokens
		newMetadata["credits"] = currentCredits + CreatorTokens
	case "enterprise":
		newMetadata["subscriptionPlan"] = "enterprise"
		newMetadata["subscriptionStatus"] = "active"
		newMetadata["creditsPerCycle"] = EnterpriseTokens
		newMetadata["credits"] = currentCredits + EnterpriseTokens
	case "topup":
		// Retrieve purchased quantity from Stripe via the checkout session.
		stripeKey := os.Getenv("STRIPE_API_KEY")
		if stripeKey == "" {
			log.Println("STRIPE_API_KEY not set")
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Body:       "Server Error",
			}, nil
		}
		stripe.Key = stripeKey

		params := &stripe.CheckoutSessionListLineItemsParams{
			Session: stripe.String(payload.StripeSessionId),
		}
		iter := stripeSession.ListLineItems(params)
		totalQuantity := 0
		for iter.Next() {
			li := iter.Current()
			if lineItem, ok := li.(*stripe.LineItem); ok {
				totalQuantity += int(lineItem.Quantity)
			}
		}
		if err := iter.Err(); err != nil {
			log.Printf("Error retrieving line items: %v", err)
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Body:       "Error retrieving stripe line items",
			}, nil
		}

		tokensToAdd := totalQuantity * TopupTokensPerItem
		newMetadata["credits"] = currentCredits + tokensToAdd
	case "lifetime":
		newMetadata["subscriptionPlan"] = "lifetime"
		newMetadata["subscriptionStatus"] = "active"
		newMetadata["unlimited"] = true
	default:
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Body:       "Unknown product type",
		}, nil
	}

	// Marshal new metadata to JSON.
	metaJSON, err := json.Marshal(newMetadata)
	if err != nil {
		log.Printf("Error marshaling metadata: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       "Server Error",
		}, nil
	}
	updateParams := user.UpdateMetadataParams{
		PublicMetadata: (*json.RawMessage)(&metaJSON),
	}
	if _, err := client.UpdateMetadata(context.Background(), payload.ClerkUserId, &updateParams); err != nil {
		log.Printf("Error updating metadata: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       "Error updating metadata",
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       "Subscription verified and metadata updated",
	}, nil
}

func main() {
	lambda.Start(handler)
}
