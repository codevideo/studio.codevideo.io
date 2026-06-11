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

func TestDeletedSubscriptionWithUnrecognizedPriceIsIgnored(t *testing.T) {
	body := `{
		"type": "customer.subscription.deleted",
		"data": {
			"object": {
				"id": "sub_test",
				"customer": "cus_test",
				"customer_email": "gary@example.com",
				"status": "canceled",
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
