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

var TokenCosts = map[string]int{
	"":                 0,
	"json":             0,
	"markdown":         0,
	"complex-markdown": 1,
	"zip":              1,
	"png":              1,
	"gif":              1,
	"html":             2,
	"pdf":              3,
	"tsx":              4,
	"jsx":              4,
	"pptx":             6,
	"mp4":              10,
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

type DecrementRequest struct {
	ClerkUserToken string `json:"clerkUserToken"`
	ExportType     string `json:"exportType"`
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
	// Validate the export type and get the decrement amount
	decrementAmount, ok := TokenCosts[decReq.ExportType]
	if !ok {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       "Invalid export type",
		}, nil
	}
	if decrementAmount <= 0 {
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Invalid tokens value"}, nil
	}

	apiKey := os.Getenv("CLERK_SECRET_KEY")
	if apiKey == "" {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Server Error"}, nil
	}

	// get the clerkUserId (sub) from the JWT token
	clerkUserId := extractSubFromJWT(decReq.ClerkUserToken)
	if clerkUserId == "" {
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Invalid clerkUserToken"}, nil
	}

	return chargeExport(context.Background(), newClerkUsers(apiKey), clerkUserId, decrementAmount), nil
}

// chargeExport takes an export's cost from the user's token balance. Lifetime
// plans set unlimited in public metadata and are never charged.
func chargeExport(ctx context.Context, users clerkUsers, clerkUserId string, decrementAmount int) events.APIGatewayProxyResponse {
	// Fetch the clerkUser so we can get the current token balance.
	clerkUser, err := users.Get(ctx, clerkUserId)
	if err != nil {
		log.Printf("Error fetching user: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error fetching user"}
	}

	var meta map[string]interface{}
	if clerkUser.PublicMetadata != nil {
		_ = json.Unmarshal(clerkUser.PublicMetadata, &meta)
	}
	currentTokens := tokensFromMetadata(meta)

	if unlimited, _ := meta["unlimited"].(bool); unlimited {
		log.Printf("Unlimited plan; export not charged")
		response, _ := json.Marshal(map[string]interface{}{"newTokens": currentTokens, "unlimited": true})
		return events.APIGatewayProxyResponse{StatusCode: 200, Body: string(response)}
	}

	if currentTokens < decrementAmount {
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Insufficient tokens"}
	}

	newTokens := currentTokens - decrementAmount
	metadata, _ := json.Marshal(map[string]interface{}{"tokens": newTokens})
	params := user.UpdateMetadataParams{
		PublicMetadata: (*json.RawMessage)(&metadata),
	}

	if _, err := users.UpdateMetadata(ctx, clerkUserId, &params); err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error updating metadata"}
	}

	log.Printf("Successfully decremented tokens from %d to %d", currentTokens, newTokens)

	response, _ := json.Marshal(map[string]interface{}{"newTokens": newTokens})
	return events.APIGatewayProxyResponse{StatusCode: 200, Body: string(response)}
}

// tokensFromMetadata reads the balance, which is stored as a number (or,
// in older accounts, as text).
func tokensFromMetadata(meta map[string]interface{}) int {
	switch v := meta["tokens"].(type) {
	case float64:
		return int(v)
	case string:
		tokens, _ := strconv.Atoi(v)
		return tokens
	default:
		return 0
	}
}

func main() {
	lambda.Start(handler)
}
