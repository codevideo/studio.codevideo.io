package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/user"
	utils "github.com/codevideo/go-utils/slack"
)

// StripeEvent represents a minimal Stripe webhook event.
type StripeEvent struct {
	Type string `json:"type"`
	Data struct {
		Object json.RawMessage `json:"object"`
	} `json:"data"`
}

// Subscription represents the relevant parts of a Stripe subscription.
type Subscription struct {
	ID            string `json:"id"`
	Customer      string `json:"customer"`
	CustomerEmail string `json:"customer_email"`
	Items         struct {
		Data []struct {
			Plan struct {
				ID string `json:"id"`
			} `json:"plan"`
		} `json:"data"`
	} `json:"items"`
	Status string `json:"status"`
}

// Hardcoded configuration for each monthly subscription.
const (
	StarterTokens    = 50
	CreatorTokens    = 500
	EnterpriseTokens = 10000
)

// Mapping from Stripe plan ID to our product and tokens per cycle.
var planMapping = map[string]struct {
	product        string
	tokensPerCycle int
}{
	"price_starter":    {"starter", StarterTokens},
	"price_creator":    {"creator", CreatorTokens},
	"price_enterprise": {"enterprise", EnterpriseTokens},
}

func handler(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Only allow POST.
	if req.HTTPMethod != "POST" {
		return events.APIGatewayProxyResponse{StatusCode: http.StatusMethodNotAllowed, Body: "Method Not Allowed"}, nil
	}

	var eventData StripeEvent
	if err := json.Unmarshal([]byte(req.Body), &eventData); err != nil {
		log.Printf("Error parsing webhook event: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest, Body: "Bad Request"}, nil
	}

	// We only process subscription updated events.
	if eventData.Type != "customer.subscription.updated" {
		return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: "Ignored"}, nil
	}

	var sub Subscription
	if err := json.Unmarshal(eventData.Data.Object, &sub); err != nil {
		log.Printf("Error parsing subscription object: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest, Body: "Bad Request"}, nil
	}

	// Check that there is at least one subscription item.
	if len(sub.Items.Data) == 0 {
		log.Println("No subscription items found")
		return events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest, Body: "No subscription items"}, nil
	}

	planID := sub.Items.Data[0].Plan.ID
	mapping, ok := planMapping[planID]
	if !ok {
		log.Printf("Plan ID %s not recognized for monthly subscription", planID)
		return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: "Ignored"}, nil
	}

	// Use the customer email from the subscription.
	customerEmail := sub.CustomerEmail
	if customerEmail == "" {
		log.Println("Subscription missing customer email")
		return events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest, Body: "No customer email"}, nil
	}

	// Initialize Clerk client.
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

	// Lookup Clerk user by email.
	listParams := &user.ListParams{
		EmailAddresses: []string{customerEmail},
	}
	userList, err := client.List(context.Background(), listParams)
	if err != nil || len(userList.Users) == 0 {
		log.Printf("Error finding Clerk user by email: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Error finding user"}, nil
	}
	clerkUser := userList.Users[0]

	// Prepare metadata update.
	newMetadata := map[string]interface{}{
		"subscriptionPlan":   mapping.product,
		"subscriptionStatus": sub.Status, // e.g., "active"
		"tokensPerCycle":     mapping.tokensPerCycle,
	}

	metaJSON, err := json.Marshal(newMetadata)
	if err != nil {
		log.Printf("Error marshaling metadata: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Server Error"}, nil
	}
	updateParams := user.UpdateMetadataParams{PublicMetadata: (*json.RawMessage)(&metaJSON)}
	if _, err := client.UpdateMetadata(context.Background(), clerkUser.ID, &updateParams); err != nil {
		log.Printf("Error updating Clerk metadata: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Error updating metadata"}, nil
	}

	// Send Slack notification.
	err = utils.SendSlackMessage("Subscription update for " + customerEmail + ": new plan " + mapping.product)
	if err != nil {
		log.Printf("Error sending Slack message: %v", err)
	}

	return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: "Subscription metadata updated"}, nil
}

func main() {
	lambda.Start(handler)
}
