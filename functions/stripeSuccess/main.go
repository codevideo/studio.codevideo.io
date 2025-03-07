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

	stripe "github.com/stripe/stripe-go/v81"
	stripeSession "github.com/stripe/stripe-go/v81/checkout/session"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/user"
	utils "github.com/codevideo/go-utils/slack"
)

// StripeSuccessRequest is the payload expected from the client.
type StripeSuccessRequest struct {
	ClerkUserId     string `json:"clerkUserId"`
	StripeSessionId string `json:"stripeSessionId"`
	Product         string `json:"product"` // e.g. "starter", "creator", "enterprise", "topup", "lifetime"
}

// ResponseData is returned to the client.
type ResponseData struct {
	Success      bool   `json:"success"`
	Email        string `json:"email,omitempty"`
	TempPassword string `json:"tempPassword,omitempty"`
}

// Hardcoded configuration for each product.
const (
	StarterTokens      = 50
	CreatorTokens      = 500
	EnterpriseTokens   = 10000
	TopupTokensPerItem = 10
)

// generateTempPassword creates a temporary password in the format "codevideo_<randomhex>"
func generateTempPassword() string {
	b := make([]byte, 8) // 8 bytes = 16 hex characters
	if _, err := rand.Read(b); err != nil {
		log.Printf("Error generating random bytes: %v", err)
		return "codevideo_default"
	}
	return "codevideo_" + hex.EncodeToString(b)
}

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

	apiKey := os.Getenv("CLERK_SECRET_KEY")
	if apiKey == "" {
		log.Println("CLERK_SECRET_KEY not set")
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       "Server Error",
		}, nil
	}
	config := &clerk.ClientConfig{}
	config.Key = &apiKey
	client := user.NewClient(config)

	// Track whether we're creating a new user.
	var tempPassword string
	var clerkUserId string
	if payload.ClerkUserId == "" {
		// Initialize Stripe.
		stripeKey := os.Getenv("STRIPE_SECRET_KEY")
		if stripeKey == "" {
			log.Fatalf("STRIPE_SECRET_KEY not set")
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Body:       "Server Error",
			}, nil
		}
		stripe.Key = stripeKey

		// Retrieve the checkout session to get the customer's email.
		session, err := stripeSession.Get(payload.StripeSessionId, nil)
		if err != nil {
			log.Printf("Error retrieving stripe session: %v", err)
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Body:       "Error retrieving stripe session",
			}, nil
		}
		if session.CustomerDetails == nil || session.CustomerDetails.Email == "" {
			log.Println("Stripe session missing customer email")
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusBadRequest,
				Body:       "No customer email found",
			}, nil
		}

		// Generate a temporary password.
		tempPassword = generateTempPassword()

		// Create a new Clerk user using the Stripe customer email and temporary password.
		createParams := user.CreateParams{
			EmailAddresses: &[]string{session.CustomerDetails.Email},
			Password:       &tempPassword,
		}
		newUser, err := client.Create(context.Background(), &createParams)
		if err != nil {
			log.Printf("Error creating new Clerk user: %v", err)
			return events.APIGatewayProxyResponse{
				StatusCode: http.StatusInternalServerError,
				Body:       "Error creating user",
			}, nil
		}
		clerkUserId = newUser.ID
	} else {
		clerkUserId = payload.ClerkUserId
	}

	// Fetch the current clerkUser so we can add to the existing tokens.
	clerkUser, err := client.Get(context.Background(), clerkUserId)
	if err != nil {
		log.Printf("Error fetching user: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       "Error fetching user",
		}, nil
	}

	// Retrieve current tokens from public metadata (default to 0 if not set).
	currentTokens := 0
	if clerkUser.PublicMetadata != nil {
		var meta map[string]interface{}
		if err := json.Unmarshal(clerkUser.PublicMetadata, &meta); err == nil {
			if tokensVal, ok := meta["tokens"]; ok {
				switch v := tokensVal.(type) {
				case float64:
					currentTokens = int(v)
				case string:
					if i, err := strconv.Atoi(v); err == nil {
						currentTokens = i
					}
				}
			}
		}
	}

	// Prepare new metadata changes.
	newMetadata := make(map[string]interface{})
	// Always update the stripeId.
	newMetadata["stripeId"] = payload.StripeSessionId

	// slack message of the product type that was just purchased
	err = utils.SendSlackMessage("$$$ A user just purchased the " + payload.Product + " product!!!")
	if err != nil {
		log.Printf("Error sending Slack message: %v", err)
	}

	switch payload.Product {
	case "starter":
		newMetadata["subscriptionPlan"] = "starter"
		newMetadata["subscriptionStatus"] = "active"
		newMetadata["tokensPerCycle"] = StarterTokens
		newMetadata["tokens"] = currentTokens + StarterTokens
	case "creator":
		newMetadata["subscriptionPlan"] = "creator"
		newMetadata["subscriptionStatus"] = "active"
		newMetadata["tokensPerCycle"] = CreatorTokens
		newMetadata["tokens"] = currentTokens + CreatorTokens
	case "enterprise":
		newMetadata["subscriptionPlan"] = "enterprise"
		newMetadata["subscriptionStatus"] = "active"
		newMetadata["tokensPerCycle"] = EnterpriseTokens
		newMetadata["tokens"] = currentTokens + EnterpriseTokens
	case "topup":
		// Retrieve purchased quantity from Stripe via the checkout session.
		stripeKey := os.Getenv("STRIPE_SECRET_KEY")
		if stripeKey == "" {
			log.Fatalf("STRIPE_SECRET_KEY not set")
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
		newMetadata["tokens"] = currentTokens + tokensToAdd
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
	if _, err := client.UpdateMetadata(context.Background(), clerkUserId, &updateParams); err != nil {
		log.Printf("Error updating metadata: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       "Error updating metadata",
		}, nil
	}

	// Build the response.
	respData := ResponseData{
		Success: true,
	}
	// Include the temporary password in the response if a new user was created.
	if payload.ClerkUserId == "" {
		respData.Email = clerkUser.EmailAddresses[0].EmailAddress
		respData.TempPassword = tempPassword
	}

	respJSON, err := json.Marshal(respData)
	if err != nil {
		log.Printf("Error marshaling response: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       "Server Error",
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       string(respJSON),
	}, nil
}

func main() {
	lambda.Start(handler)
}
