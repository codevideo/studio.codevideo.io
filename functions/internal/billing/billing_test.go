package billing

import (
	"encoding/json"
	"os"
	"strings"
	"testing"
)

func TestPriceIDToPlanFromEnvIncludesConfiguredAndLegacyIDs(t *testing.T) {
	t.Setenv("STRIPE_CREATOR_PRICE_ID", "price_live_creator")
	t.Setenv("STRIPE_STARTER_PRICE_ID", "")
	t.Setenv("STRIPE_ENTERPRISE_PRICE_ID", "")

	mapping, missing := PriceIDToPlanFromEnv()
	if mapping["price_live_creator"].Product != "creator" {
		t.Fatalf("expected configured creator price to map to creator, got %#v", mapping["price_live_creator"])
	}
	if mapping["price_creator"].Product != "creator" {
		t.Fatalf("expected legacy creator price to remain supported")
	}
	if len(missing) != 2 {
		t.Fatalf("expected two missing env vars, got %v", missing)
	}

	os.Unsetenv("STRIPE_CREATOR_PRICE_ID")
}

func TestApplyGrantAddsTokensOnlyOnce(t *testing.T) {
	publicMeta := map[string]interface{}{"tokens": float64(50)}
	privateMeta := map[string]interface{}{}

	nextPublic, nextPrivate, granted := ApplyGrant(publicMeta, privateMeta, "invoice:in_123", 500)
	if !granted {
		t.Fatal("expected first grant to be applied")
	}
	if got := TokensFromMetadata(nextPublic); got != 550 {
		t.Fatalf("expected 550 tokens, got %d", got)
	}

	nextPublic, _, granted = ApplyGrant(nextPublic, nextPrivate, "invoice:in_123", 500)
	if granted {
		t.Fatal("expected duplicate grant to be ignored")
	}
	if got := TokensFromMetadata(nextPublic); got != 550 {
		t.Fatalf("expected duplicate grant to preserve 550 tokens, got %d", got)
	}
}

func TestCheckoutAndInvoiceInitialGrantKeysMatch(t *testing.T) {
	checkoutKey := CheckoutGrantKey("cs_123", "sub_123", "")
	invoiceKey := InvoiceGrantKey("in_123", "sub_123", "subscription_create")
	if checkoutKey != invoiceKey {
		t.Fatalf("expected same initial subscription key, got %q and %q", checkoutKey, invoiceKey)
	}
}

func TestIDRefParsesStringAndExpandedObject(t *testing.T) {
	var stringRef IDRef
	if err := json.Unmarshal([]byte(`"cus_123"`), &stringRef); err != nil {
		t.Fatalf("unexpected string ref error: %v", err)
	}
	if stringRef.ID != "cus_123" {
		t.Fatalf("expected cus_123, got %q", stringRef.ID)
	}

	var objectRef IDRef
	if err := json.Unmarshal([]byte(`{"id":"sub_123","object":"subscription"}`), &objectRef); err != nil {
		t.Fatalf("unexpected object ref error: %v", err)
	}
	if objectRef.ID != "sub_123" {
		t.Fatalf("expected sub_123, got %q", objectRef.ID)
	}
}

func TestSlackMessageIncludesSortedFields(t *testing.T) {
	msg := SlackMessage("Billing event", map[string]string{
		"subscription": "sub_123",
		"email":        "gary@example.com",
	})
	if !strings.HasPrefix(msg, "Billing event\n- email: gary@example.com\n- subscription: sub_123") {
		t.Fatalf("unexpected Slack message: %q", msg)
	}
}
