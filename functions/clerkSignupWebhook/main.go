package main

import (
	"context"
	"encoding/json"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/user"
	utils "github.com/codevideo/go-utils/slack"
)

type ClerkWebhookEvent struct {
	Type string `json:"type"`
	Data struct {
		ID        string `json:"id"`
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Email     string `json:"email"`
	} `json:"data"`
}

func handler(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if req.HTTPMethod != "POST" {
		return events.APIGatewayProxyResponse{StatusCode: 405, Body: "Method Not Allowed"}, nil
	}

	var eventData ClerkWebhookEvent
	if err := json.Unmarshal([]byte(req.Body), &eventData); err != nil {
		log.Printf("JSON parse error: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Bad Request"}, nil
	}

	if eventData.Type == "user.created" {
		apiKey := os.Getenv("CLERK_SECRET_KEY")
		if apiKey == "" {
			log.Println("CLERK_SECRET_KEY not set")
			return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Server Error"}, nil
		}
		config := &clerk.ClientConfig{}
		config.Key = &apiKey
		client := user.NewClient(config)
		metadata, _ := json.Marshal(map[string]interface{}{"tokens": 50})
		params := user.UpdateMetadataParams{
			PublicMetadata: (*json.RawMessage)(&metadata),
		}

		// slack message the user's email and they have been created
		err := utils.SendSlackMessage("New user just signed up! " + eventData.Data.FirstName + " " + eventData.Data.LastName + " (" + eventData.Data.Email + ")")
		if err != nil {
			log.Printf("Error sending Slack message: %v", err)
		}

		if _, err := client.UpdateMetadata(context.Background(), eventData.Data.ID, &params); err != nil {
			log.Printf("Error updating metadata: %v", err)
			return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error updating metadata"}, nil
		}
	}

	return events.APIGatewayProxyResponse{StatusCode: 200, Body: "Processed"}, nil
}

func main() {
	lambda.Start(handler)
}
