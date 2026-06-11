package main

import (
	"net/http"
	"strings"
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

func TestSubscriptionCreatedWithUnrecognizedPriceIsIgnored(t *testing.T) {
	body := `{
		"type": "customer.subscription.created",
		"data": {
			"object": {
				"id": "sub_test",
				"customer": "cus_test",
				"customer_email": "gary@example.com",
				"status": "active",
				"items": {
					"data": [
						{"price": {"id": "price_unknown"}}
					]
				}
			}
		}
	}`

	resp, err := handler(events.APIGatewayProxyRequest{HTTPMethod: http.MethodPost, Body: body})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}
	if !strings.Contains(resp.Body, "Ignored") {
		t.Fatalf("expected ignored response, got %q", resp.Body)
	}
}

func TestSubscriptionCreatedRequiresStripeKeyWhenEmailMissing(t *testing.T) {
	t.Setenv("STRIPE_CREATOR_PRICE_ID", "price_creator_live")
	t.Setenv("STRIPE_SECRET_KEY", "")

	body := `{
		"type": "customer.subscription.created",
		"data": {
			"object": {
				"id": "sub_test",
				"customer": "cus_test",
				"status": "active",
				"items": {
					"data": [
						{"price": {"id": "price_creator_live"}}
					]
				}
			}
		}
	}`

	resp, err := handler(events.APIGatewayProxyRequest{HTTPMethod: http.MethodPost, Body: body})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusInternalServerError {
		t.Fatalf("expected 500, got %d", resp.StatusCode)
	}
}
