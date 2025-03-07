package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

// SlackMessage defines the payload to be sent to Slack.
type SlackMessage struct {
	Text string `json:"text"`
}

// SendSlackMessage sends a message to Slack using the webhook URL from the environment.
// It only requires the message to be passed in.
func SendSlackMessage(message string) error {
	webhookURL := os.Getenv("CODEVIDEO_SLACK_WEBHOOK_URL")
	if webhookURL == "" {
		return fmt.Errorf("CODEVIDEO_SLACK_WEBHOOK_URL not set")
	}

	slackMsg := SlackMessage{Text: message}
	payload, err := json.Marshal(slackMsg)
	if err != nil {
		return fmt.Errorf("error marshaling slack message: %w", err)
	}

	// Create an HTTP client with a timeout.
	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	req, err := http.NewRequest("POST", webhookURL, bytes.NewBuffer(payload))
	if err != nil {
		return fmt.Errorf("error creating request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("error sending request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to send slack message, status code: %d", resp.StatusCode)
	}

	return nil
}
