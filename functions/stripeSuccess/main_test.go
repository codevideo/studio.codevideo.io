package main

import (
	"net/http"
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

func TestHandlerRejectsNonPost(t *testing.T) {
	resp, err := handler(events.APIGatewayProxyRequest{HTTPMethod: http.MethodGet})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405, got %d", resp.StatusCode)
	}
}

func TestHandlerRejectsBadJSON(t *testing.T) {
	resp, err := handler(events.APIGatewayProxyRequest{HTTPMethod: http.MethodPost, Body: "{"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", resp.StatusCode)
	}
}

func TestMissingStripeSecretReturnsControlledServerError(t *testing.T) {
	t.Setenv("STRIPE_SECRET_KEY", "")

	resp, err := handler(events.APIGatewayProxyRequest{
		HTTPMethod: http.MethodPost,
		Body:       `{"stripeSessionId":"cs_test","product":"creator"}`,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusInternalServerError {
		t.Fatalf("expected 500, got %d", resp.StatusCode)
	}
}
