package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/user"
	utils "github.com/codevideo/go-utils/slack"
)

// SignupTokens is the free allowance a new account starts with.
const SignupTokens = 50

type ClerkWebhookEvent struct {
	Type string `json:"type"`
	Data struct {
		ID        string `json:"id"`
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Email     string `json:"email"`
	} `json:"data"`
}

// clerkUsers is the part of the Clerk user API this function uses.
type clerkUsers interface {
	Get(ctx context.Context, id string) (*clerk.User, error)
	UpdateMetadata(ctx context.Context, id string, params *user.UpdateMetadataParams) (*clerk.User, error)
}

var newClerkUsers = func(secretKey string) clerkUsers {
	config := &clerk.ClientConfig{}
	config.Key = &secretKey
	return user.NewClient(config)
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

		// slack message the user's email and they have been created
		err := utils.SendSlackMessage("New user just signed up! " + eventData.Data.FirstName + " " + eventData.Data.LastName + " (" + eventData.Data.Email + ")")
		if err != nil {
			log.Printf("Error sending Slack message: %v", err)
		}

		if _, err := grantSignupTokens(context.Background(), newClerkUsers(apiKey), eventData.Data.ID); err != nil {
			log.Printf("Error updating metadata: %v", err)
			return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error updating metadata"}, nil
		}
	}

	return events.APIGatewayProxyResponse{StatusCode: 200, Body: "Processed"}, nil
}

// grantSignupTokens gives a new user the free allowance unless they already
// have a token balance, and reports whether it did. Users who accept a Clerk
// invitation arrive with tokens already set: Full Stack Craft's Video Tools
// Bundle invites its monthly buyers with their first 500 tokens. The user is
// re-read from Clerk instead of trusting the event body, so a replayed event
// cannot reset an existing balance either.
func grantSignupTokens(ctx context.Context, users clerkUsers, userID string) (bool, error) {
	clerkUser, err := users.Get(ctx, userID)
	if err != nil {
		return false, fmt.Errorf("get user: %w", err)
	}
	if hasTokenBalance(clerkUser.PublicMetadata) {
		return false, nil
	}

	metadata, _ := json.Marshal(map[string]interface{}{"tokens": SignupTokens})
	params := user.UpdateMetadataParams{
		PublicMetadata: (*json.RawMessage)(&metadata),
	}
	if _, err := users.UpdateMetadata(ctx, userID, &params); err != nil {
		return false, fmt.Errorf("update metadata: %w", err)
	}
	return true, nil
}

// hasTokenBalance reports whether public metadata already holds a token
// balance, including a balance of zero.
func hasTokenBalance(publicMetadata json.RawMessage) bool {
	var meta map[string]interface{}
	if len(publicMetadata) == 0 || json.Unmarshal(publicMetadata, &meta) != nil {
		return false
	}
	tokens, ok := meta["tokens"]
	return ok && tokens != nil
}

func main() {
	lambda.Start(handler)
}
