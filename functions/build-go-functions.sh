#!/bin/bash

# This script builds the Go functions for AWS Lambda

set -e

FUNCTIONS=("clerkSignupWebhook" "contactForm" "decrementTokens" "stripeSuccess")

for f in "${FUNCTIONS[@]}"; do
  echo "Building $f..."
  GOOS=linux GOARCH=amd64 go build -o "$f" "$f/main.go"
done