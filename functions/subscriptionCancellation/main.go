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

type StripeEvent struct {
	Type string `json:"type"`
	Data struct {
		Object json.RawMessage `json:"object"`
	} `json:"data"`
}

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

	// Process only subscription cancellation events.
	if eventData.Type != "customer.subscription.deleted" {
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

	// Process only monthly subscriptions.
	monthlyPlans := map[string]bool{
		"price_starter":    true,
		"price_creator":    true,
		"price_enterprise": true,
	}
	if !monthlyPlans[planID] {
		log.Printf("Plan ID %s is not a monthly subscription", planID)
		return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: "Ignored"}, nil
	}

	// Use customer email.
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

	// Prepare metadata update: clear subscriptionPlan, mark as canceled.
	newMetadata := map[string]interface{}{
		"subscriptionPlan":   "",
		"subscriptionStatus": "canceled",
		"tokensPerCycle":     0,
	}

	metaJSON, err := json.Marshal(newMetadata)
	if err != nil {
		log.Printf("Error marshaling metadata: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Server Error"}, nil
	}
	updateParams := user.UpdateMetadataParams{PublicMetadata: (*json.RawMessage)(&metaJSON)}
	if _, err := client.UpdateMetadata(context.Background(), clerkUser.ID, &updateParams); err != nil {
		log.Printf("Error updating metadata: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError, Body: "Error updating metadata"}, nil
	}

	// Send a Slack notification.
	err = utils.SendSlackMessage("Subscription cancelled for " + customerEmail)
	if err != nil {
		log.Printf("Error sending Slack message: %v", err)
	}

	return events.APIGatewayProxyResponse{StatusCode: http.StatusOK, Body: "Cancellation processed and metadata updated"}, nil
}

func main() {
	lambda.Start(handler)
}
