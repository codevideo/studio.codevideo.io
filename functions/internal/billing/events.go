package billing

import "encoding/json"

type StripeEvent struct {
	Type string `json:"type"`
	Data struct {
		Object json.RawMessage `json:"object"`
	} `json:"data"`
}

type SubscriptionEvent struct {
	ID                 string `json:"id"`
	Customer           IDRef  `json:"customer"`
	CustomerEmail      string `json:"customer_email"`
	CurrentPeriodStart int64  `json:"current_period_start"`
	Items              struct {
		Data []struct {
			Price IDRef `json:"price"`
			Plan  IDRef `json:"plan"`
		} `json:"data"`
	} `json:"items"`
	Status string `json:"status"`
}

type InvoiceEvent struct {
	ID            string `json:"id"`
	BillingReason string `json:"billing_reason"`
	Customer      IDRef  `json:"customer"`
	CustomerEmail string `json:"customer_email"`
	Lines         struct {
		Data []struct {
			Price IDRef `json:"price"`
			Plan  IDRef `json:"plan"`
		} `json:"data"`
	} `json:"lines"`
	Paid         bool   `json:"paid"`
	Status       string `json:"status"`
	Subscription IDRef  `json:"subscription"`
}

func ParseStripeEvent(body string) (StripeEvent, error) {
	var event StripeEvent
	err := json.Unmarshal([]byte(body), &event)
	return event, err
}

func ParseSubscription(raw json.RawMessage) (SubscriptionEvent, error) {
	var sub SubscriptionEvent
	err := json.Unmarshal(raw, &sub)
	return sub, err
}

func ParseInvoice(raw json.RawMessage) (InvoiceEvent, error) {
	var invoice InvoiceEvent
	err := json.Unmarshal(raw, &invoice)
	return invoice, err
}

func FirstSubscriptionPriceID(sub SubscriptionEvent) string {
	for _, item := range sub.Items.Data {
		if item.Price.ID != "" {
			return item.Price.ID
		}
		if item.Plan.ID != "" {
			return item.Plan.ID
		}
	}
	return ""
}

func FirstInvoicePriceID(invoice InvoiceEvent) string {
	for _, line := range invoice.Lines.Data {
		if line.Price.ID != "" {
			return line.Price.ID
		}
		if line.Plan.ID != "" {
			return line.Plan.ID
		}
	}
	return ""
}
