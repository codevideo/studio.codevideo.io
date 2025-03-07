package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	utils "github.com/codevideo/go-utils/slack"
	mailjet "github.com/mailjet/mailjet-apiv3-go"
)

// Response is used to marshal the JSON response.
type Response struct {
	Success bool `json:"success"`
}

func handler(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Return error if no body was sent.
	if req.Body == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Body:       "No body",
		}, nil
	}

	// Parse the incoming JSON body.
	var bodyMap map[string]interface{}
	if err := json.Unmarshal([]byte(req.Body), &bodyMap); err != nil {
		log.Printf("Error parsing JSON: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Body:       "Bad Request",
		}, nil
	}

	// Build HTML content.
	htmlParts := []string{"<h1>CodeVideo Contact Data:</h1>"}
	for key, value := range bodyMap {
		htmlParts = append(htmlParts, fmt.Sprintf("<p><b>%s:</b> %v</p>", key, value))
	}
	htmlContent := strings.Join(htmlParts, "\n")

	slackMessageContent := fmt.Sprintf("New contact form submission: %v", bodyMap)

	// slack message of the product type that was just purchased
	err := utils.SendSlackMessage(slackMessageContent)
	if err != nil {
		log.Printf("Error sending Slack message: %v", err)
	}

	// Initialize Mailjet client.
	mjPublic := os.Getenv("MJ_APIKEY_PUBLIC")
	mjPrivate := os.Getenv("MJ_APIKEY_PRIVATE")
	if mjPublic == "" || mjPrivate == "" {
		log.Println("Mailjet API keys are not set")
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       "Server Error",
		}, nil
	}
	mailjetClient := mailjet.NewMailjetClient(mjPublic, mjPrivate)

	singleRecipient := mailjet.RecipientV31{
		Email: "hi@fullstackcraft.com",
		Name:  "Full Stack Craft",
	}
	// Build the Mailjet message.
	messagesInfo := []mailjet.InfoMessagesV31{
		{
			From: &mailjet.RecipientV31{
				Email: "hi@fullstackcraft.com",
				Name:  "Full Stack Craft",
			},
			To:       &mailjet.RecipientsV31{singleRecipient},
			Subject:  "CodeVideo Contact Form Submission",
			HTMLPart: htmlContent,
		},
	}
	messages := mailjet.MessagesV31{Info: messagesInfo}

	// Send the email via Mailjet.
	_, err = mailjetClient.SendMailV31(&messages)
	if err != nil {
		log.Printf("Mailjet error: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       `{"success": false}`,
		}, nil
	}

	// Prepare and send a Slack message.
	bodyJSON, err := json.Marshal(bodyMap)
	if err != nil {
		log.Printf("Error marshalling body for Slack: %v", err)
	}
	slackMsg := fmt.Sprintf("New contact form submission: %s", string(bodyJSON))
	if err := utils.SendSlackMessage(slackMsg); err != nil {
		log.Printf("Error sending Slack message: %v", err)
	}

	// Return a success response.
	respBody, _ := json.Marshal(Response{Success: true})
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       string(respBody),
	}, nil
}

func main() {
	lambda.Start(handler)
}
