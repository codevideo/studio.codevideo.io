package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/user"
)

type fakeUsers struct {
	publicMetadata string
	getErr         error
	updates        []map[string]interface{}
}

func (f *fakeUsers) Get(_ context.Context, id string) (*clerk.User, error) {
	if f.getErr != nil {
		return nil, f.getErr
	}
	return &clerk.User{ID: id, PublicMetadata: json.RawMessage(f.publicMetadata)}, nil
}

func (f *fakeUsers) UpdateMetadata(_ context.Context, id string, params *user.UpdateMetadataParams) (*clerk.User, error) {
	update := map[string]interface{}{}
	if params.PublicMetadata != nil {
		if err := json.Unmarshal(*params.PublicMetadata, &update); err != nil {
			return nil, err
		}
	}
	f.updates = append(f.updates, update)
	return &clerk.User{ID: id}, nil
}

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

func TestSignupTokens(t *testing.T) {
	tests := []struct {
		name           string
		publicMetadata string
		wantGranted    bool
	}{
		{name: "new user", publicMetadata: `{}`, wantGranted: true},
		{name: "new user without metadata", publicMetadata: ``, wantGranted: true},
		{name: "invited bundle buyer keeps their tokens", publicMetadata: `{"tokens":500,"subscriptionPlan":"creator","videoToolsBundleActive":true,"entitlementSource":"video-tools-bundle"}`},
		{name: "replayed event keeps a spent balance", publicMetadata: `{"tokens":0}`},
		{name: "replayed event keeps a balance stored as text", publicMetadata: `{"tokens":"120"}`},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			users := &fakeUsers{publicMetadata: test.publicMetadata}
			granted, err := grantSignupTokens(context.Background(), users, "user_1")
			if err != nil {
				t.Fatal(err)
			}
			if granted != test.wantGranted {
				t.Fatalf("granted = %v, want %v", granted, test.wantGranted)
			}
			if !test.wantGranted {
				if len(users.updates) != 0 {
					t.Fatalf("expected no metadata update, got %+v", users.updates)
				}
				return
			}
			if len(users.updates) != 1 || users.updates[0]["tokens"] != float64(SignupTokens) {
				t.Fatalf("expected the free allowance, got %+v", users.updates)
			}
		})
	}
}

func TestSignupTokensFailsWhenTheUserCannotBeRead(t *testing.T) {
	users := &fakeUsers{getErr: errors.New("clerk unavailable")}
	if _, err := grantSignupTokens(context.Background(), users, "user_1"); err == nil {
		t.Fatal("expected an error so Clerk retries the webhook")
	}
	if len(users.updates) != 0 {
		t.Fatalf("expected no update without reading the user, got %+v", users.updates)
	}
}
