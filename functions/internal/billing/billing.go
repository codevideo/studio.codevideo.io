package billing

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"

	utils "github.com/codevideo/go-utils/slack"
)

const (
	StarterTokens    = 50
	CreatorTokens    = 500
	EnterpriseTokens = 10000

	GrantMetadataKey = "billingTokenGrants"
)

type Plan struct {
	Product        string
	TokensPerCycle int
	EnvVar         string
	LegacyPriceID  string
}

var Plans = []Plan{
	{Product: "starter", TokensPerCycle: StarterTokens, EnvVar: "STRIPE_STARTER_PRICE_ID", LegacyPriceID: "price_starter"},
	{Product: "creator", TokensPerCycle: CreatorTokens, EnvVar: "STRIPE_CREATOR_PRICE_ID", LegacyPriceID: "price_creator"},
	{Product: "enterprise", TokensPerCycle: EnterpriseTokens, EnvVar: "STRIPE_ENTERPRISE_PRICE_ID", LegacyPriceID: "price_enterprise"},
}

type IDRef struct {
	ID string
}

func (r *IDRef) UnmarshalJSON(data []byte) error {
	if string(data) == "null" {
		r.ID = ""
		return nil
	}

	var id string
	if err := json.Unmarshal(data, &id); err == nil {
		r.ID = id
		return nil
	}

	var obj struct {
		ID string `json:"id"`
	}
	if err := json.Unmarshal(data, &obj); err != nil {
		return err
	}
	r.ID = obj.ID
	return nil
}

func (r IDRef) String() string {
	return r.ID
}

func PlanByProduct(product string) (Plan, bool) {
	for _, plan := range Plans {
		if plan.Product == product {
			return plan, true
		}
	}
	return Plan{}, false
}

func PriceIDToPlanFromEnv() (map[string]Plan, []string) {
	priceIDToPlan := make(map[string]Plan)
	var missing []string

	for _, plan := range Plans {
		if priceID := strings.TrimSpace(os.Getenv(plan.EnvVar)); priceID != "" {
			priceIDToPlan[priceID] = plan
		} else {
			missing = append(missing, plan.EnvVar)
		}

		if plan.LegacyPriceID != "" {
			priceIDToPlan[plan.LegacyPriceID] = plan
		}
	}

	return priceIDToPlan, missing
}

func MetadataMap(raw json.RawMessage) map[string]interface{} {
	meta := make(map[string]interface{})
	if len(raw) == 0 || string(raw) == "null" {
		return meta
	}
	if err := json.Unmarshal(raw, &meta); err != nil {
		return make(map[string]interface{})
	}
	return meta
}

func TokensFromMetadata(meta map[string]interface{}) int {
	switch v := meta["tokens"].(type) {
	case float64:
		return int(v)
	case int:
		return v
	case json.Number:
		i, _ := v.Int64()
		return int(i)
	case string:
		i, _ := strconv.Atoi(v)
		return i
	default:
		return 0
	}
}

func ApplySubscriptionMetadata(meta map[string]interface{}, plan Plan, status string, stripeCustomerID string, stripeSubscriptionID string, priceID string) map[string]interface{} {
	next := CloneMetadata(meta)
	next["subscriptionPlan"] = plan.Product
	next["subscriptionStatus"] = status
	next["tokensPerCycle"] = plan.TokensPerCycle
	next["stripePriceId"] = priceID
	if stripeCustomerID != "" {
		next["stripeCustomerId"] = stripeCustomerID
	}
	if stripeSubscriptionID != "" {
		next["stripeSubscriptionId"] = stripeSubscriptionID
	}
	next["subscriptionUpdatedAt"] = time.Now().UTC().Unix()
	return next
}

func ApplyCancellationMetadata(meta map[string]interface{}, stripeCustomerID string, stripeSubscriptionID string, priceID string) map[string]interface{} {
	next := CloneMetadata(meta)
	next["subscriptionPlan"] = ""
	next["subscriptionStatus"] = "canceled"
	next["tokensPerCycle"] = 0
	next["stripePriceId"] = priceID
	if stripeCustomerID != "" {
		next["stripeCustomerId"] = stripeCustomerID
	}
	if stripeSubscriptionID != "" {
		next["stripeSubscriptionId"] = stripeSubscriptionID
	}
	next["subscriptionUpdatedAt"] = time.Now().UTC().Unix()
	return next
}

func ApplyGrant(publicMeta map[string]interface{}, privateMeta map[string]interface{}, grantKey string, tokens int) (map[string]interface{}, map[string]interface{}, bool) {
	nextPublic := CloneMetadata(publicMeta)
	nextPrivate := CloneMetadata(privateMeta)
	if grantKey == "" || tokens <= 0 {
		return nextPublic, nextPrivate, false
	}

	grants := grantsMap(nextPrivate)
	if granted, ok := grants[grantKey].(bool); ok && granted {
		return nextPublic, nextPrivate, false
	}

	grants[grantKey] = true
	nextPrivate[GrantMetadataKey] = grants
	nextPublic["tokens"] = TokensFromMetadata(nextPublic) + tokens
	nextPublic["lastTokenGrantKey"] = grantKey
	nextPublic["lastTokenGrantAt"] = time.Now().UTC().Unix()
	return nextPublic, nextPrivate, true
}

func HasGrant(privateMeta map[string]interface{}, grantKey string) bool {
	if grantKey == "" {
		return false
	}
	grants := grantsMap(privateMeta)
	granted, ok := grants[grantKey].(bool)
	return ok && granted
}

func CloneMetadata(meta map[string]interface{}) map[string]interface{} {
	next := make(map[string]interface{}, len(meta))
	for key, value := range meta {
		next[key] = value
	}
	return next
}

func MarshalRaw(meta map[string]interface{}) (*json.RawMessage, error) {
	body, err := json.Marshal(meta)
	if err != nil {
		return nil, err
	}
	raw := json.RawMessage(body)
	return &raw, nil
}

func InitialSubscriptionGrantKey(subscriptionID string) string {
	if subscriptionID == "" {
		return ""
	}
	return "subscription_initial:" + subscriptionID
}

func InvoiceGrantKey(invoiceID string, subscriptionID string, billingReason string) string {
	if billingReason == "subscription_create" && subscriptionID != "" {
		return InitialSubscriptionGrantKey(subscriptionID)
	}
	if invoiceID != "" {
		return "invoice:" + invoiceID
	}
	return ""
}

func CheckoutGrantKey(sessionID string, subscriptionID string, invoiceID string) string {
	if subscriptionID != "" {
		return InitialSubscriptionGrantKey(subscriptionID)
	}
	if invoiceID != "" {
		return "invoice:" + invoiceID
	}
	if sessionID != "" {
		return "checkout_session:" + sessionID
	}
	return ""
}

func SlackMessage(title string, fields map[string]string) string {
	var builder strings.Builder
	builder.WriteString(title)

	keys := make([]string, 0, len(fields))
	for key := range fields {
		keys = append(keys, key)
	}
	sort.Strings(keys)

	for _, key := range keys {
		value := strings.TrimSpace(fields[key])
		if value == "" {
			value = "<empty>"
		}
		builder.WriteString(fmt.Sprintf("\n- %s: %s", key, value))
	}

	return builder.String()
}

func Notify(title string, fields map[string]string) {
	if err := utils.SendSlackMessage(SlackMessage(title, fields)); err != nil {
		log.Printf("Error sending Slack message: %v", err)
	}
}

func StringOrEmpty(value interface{}) string {
	switch v := value.(type) {
	case string:
		return v
	case fmt.Stringer:
		return v.String()
	default:
		return fmt.Sprintf("%v", value)
	}
}

func grantsMap(privateMeta map[string]interface{}) map[string]interface{} {
	switch grants := privateMeta[GrantMetadataKey].(type) {
	case map[string]interface{}:
		return grants
	case map[string]bool:
		out := make(map[string]interface{}, len(grants))
		for key, value := range grants {
			out[key] = value
		}
		return out
	default:
		return make(map[string]interface{})
	}
}
