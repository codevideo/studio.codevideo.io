package main

import (
	"context"
	"encoding/json"
	"os"
	"strconv"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/user"
)

type DecrementRequest struct {
	Tokens int `json:"tokens"`
}

func handler(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if req.HTTPMethod != "POST" {
		return events.APIGatewayProxyResponse{StatusCode: 405, Body: "Method Not Allowed"}, nil
	}

	// For simplicity, assume the Authorization header is "Bearer <userID>"
	auth := req.Headers["Authorization"]
	if auth == "" {
		return events.APIGatewayProxyResponse{StatusCode: 401, Body: "Unauthorized"}, nil
	}
	userID := strings.TrimSpace(strings.TrimPrefix(auth, "Bearer"))
	if userID == "" {
		return events.APIGatewayProxyResponse{StatusCode: 401, Body: "Unauthorized"}, nil
	}

	var decReq DecrementRequest
	if err := json.Unmarshal([]byte(req.Body), &decReq); err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Bad Request"}, nil
	}
	if decReq.Tokens <= 0 {
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Invalid tokens value"}, nil
	}

	apiKey := os.Getenv("CLERK_API_KEY")
	config := &clerk.ClientConfig{}
	config.Key = &apiKey
	client := user.NewClient(config)

	// Fetch the clerkUser so we can get the current token balance.
	clerkUser, err := client.Get(context.Background(), userID)
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error fetching user"}, nil
	}

	// Extract current tokens (assumes tokens are stored as a number).
	currentTokens := 0
	if clerkUser.PublicMetadata != nil {
		var meta map[string]interface{}
		if err := json.Unmarshal(clerkUser.PublicMetadata, &meta); err == nil {
			switch v := meta["tokens"].(type) {
			case float64:
				currentTokens = int(v)
			case string:
				currentTokens, _ = strconv.Atoi(v)
			}
		}
	}

	if currentTokens < decReq.Tokens {
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Insufficient tokens"}, nil
	}

	newTokens := currentTokens - decReq.Tokens
	metadata, _ := json.Marshal(map[string]interface{}{"tokens": newTokens})
	params := user.UpdateMetadataParams{
		PublicMetadata: (*json.RawMessage)(&metadata),
	}

	if _, err := client.UpdateMetadata(context.Background(), userID, &params); err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error updating metadata"}, nil
	}

	response, _ := json.Marshal(map[string]interface{}{"newTokens": newTokens})
	return events.APIGatewayProxyResponse{StatusCode: 200, Body: string(response)}, nil
}

func main() {
	lambda.Start(handler)
}
