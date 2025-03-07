package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/user"
)

type DecrementRequest struct {
	ClerkUserToken  string `json:"clerkUserToken"`
	DecrementAmount int    `json:"decrementAmount"`
}

// TODO: this is probably suboptimal, clerk probably has a better way to extract the sub
func extractSubFromJWT(tokenString string) string {
	sub := ""

	parts := strings.Split(tokenString, ".")
	if len(parts) < 2 {
		return sub
	}

	// Add padding if needed
	payload := parts[1]
	if l := len(payload) % 4; l > 0 {
		payload += strings.Repeat("=", 4-l)
	}

	// Replace URL encoding characters
	payload = strings.ReplaceAll(payload, "-", "+")
	payload = strings.ReplaceAll(payload, "_", "/")

	decoded, err := base64.StdEncoding.DecodeString(payload)
	if err != nil {
		return sub
	}

	var claims map[string]interface{}
	if err := json.Unmarshal(decoded, &claims); err != nil {
		return sub
	}

	if subValue, ok := claims["sub"].(string); ok {
		sub = subValue
	}

	return sub
}

func handler(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if req.HTTPMethod != "POST" {
		return events.APIGatewayProxyResponse{StatusCode: 405, Body: "Method Not Allowed"}, nil
	}

	var decReq DecrementRequest
	if err := json.Unmarshal([]byte(req.Body), &decReq); err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Bad Request"}, nil
	}
	if decReq.ClerkUserToken == "" {
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Missing clerkUserToken"}, nil
	}
	if decReq.DecrementAmount <= 0 {
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Invalid tokens value"}, nil
	}

	apiKey := os.Getenv("CLERK_SECRET_KEY")
	if apiKey == "" {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Server Error"}, nil
	}
	config := &clerk.ClientConfig{}
	config.Key = &apiKey
	client := user.NewClient(config)

	// get the clerkUserId (sub) from the JWT token
	clerkUserId := extractSubFromJWT(decReq.ClerkUserToken)
	if clerkUserId == "" {
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Invalid clerkUserToken"}, nil
	}

	// Fetch the clerkUser so we can get the current token balance.
	clerkUser, err := client.Get(context.Background(), clerkUserId)
	if err != nil {
		log.Printf("Error fetching user: %v", err)
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

	if currentTokens < decReq.DecrementAmount {
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Insufficient tokens"}, nil
	}

	newTokens := currentTokens - decReq.DecrementAmount
	metadata, _ := json.Marshal(map[string]interface{}{"tokens": newTokens})
	params := user.UpdateMetadataParams{
		PublicMetadata: (*json.RawMessage)(&metadata),
	}

	if _, err := client.UpdateMetadata(context.Background(), clerkUserId, &params); err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error updating metadata"}, nil
	}

	log.Printf("Successfully decremented tokens from %d to %d", currentTokens, newTokens)

	response, _ := json.Marshal(map[string]interface{}{"newTokens": newTokens})
	return events.APIGatewayProxyResponse{StatusCode: 200, Body: string(response)}, nil
}

func main() {
	lambda.Start(handler)
}
