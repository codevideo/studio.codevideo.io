package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
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

func TestHandlerRejectsBadRequests(t *testing.T) {
	tests := []struct {
		name string
		req  events.APIGatewayProxyRequest
		want int
	}{
		{name: "GET", req: events.APIGatewayProxyRequest{HTTPMethod: http.MethodGet}, want: http.StatusMethodNotAllowed},
		{name: "bad JSON", req: events.APIGatewayProxyRequest{HTTPMethod: http.MethodPost, Body: "{"}, want: http.StatusBadRequest},
		{name: "missing token", req: events.APIGatewayProxyRequest{HTTPMethod: http.MethodPost, Body: `{"exportType":"mp4"}`}, want: http.StatusBadRequest},
		{name: "unknown export type", req: events.APIGatewayProxyRequest{HTTPMethod: http.MethodPost, Body: `{"clerkUserToken":"x.y.z","exportType":"exe"}`}, want: http.StatusBadRequest},
		{name: "free export type", req: events.APIGatewayProxyRequest{HTTPMethod: http.MethodPost, Body: `{"clerkUserToken":"x.y.z","exportType":"json"}`}, want: http.StatusBadRequest},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			resp, err := handler(test.req)
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if resp.StatusCode != test.want {
				t.Fatalf("expected %d, got %d (%s)", test.want, resp.StatusCode, resp.Body)
			}
		})
	}
}

func TestChargeExport(t *testing.T) {
	tests := []struct {
		name           string
		publicMetadata string
		cost           int
		wantStatus     int
		wantBody       string
		wantTokens     interface{}
	}{
		{name: "charges the balance", publicMetadata: `{"tokens":20}`, cost: 10, wantStatus: 200, wantBody: `"newTokens":10`, wantTokens: float64(10)},
		{name: "reads a balance stored as text", publicMetadata: `{"tokens":"20"}`, cost: 3, wantStatus: 200, wantBody: `"newTokens":17`, wantTokens: float64(17)},
		{name: "rejects an export the balance cannot cover", publicMetadata: `{"tokens":5}`, cost: 10, wantStatus: 400, wantBody: "Insufficient tokens"},
		{name: "never charges a lifetime plan", publicMetadata: `{"tokens":3,"unlimited":true,"subscriptionPlan":"lifetime"}`, cost: 10, wantStatus: 200, wantBody: `"unlimited":true`},
		{name: "charges when unlimited was removed", publicMetadata: `{"tokens":30,"unlimited":false}`, cost: 10, wantStatus: 200, wantBody: `"newTokens":20`, wantTokens: float64(20)},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			users := &fakeUsers{publicMetadata: test.publicMetadata}
			resp := chargeExport(context.Background(), users, "user_1", test.cost)
			if resp.StatusCode != test.wantStatus || !strings.Contains(resp.Body, test.wantBody) {
				t.Fatalf("got %d %q, want %d containing %q", resp.StatusCode, resp.Body, test.wantStatus, test.wantBody)
			}
			if test.wantTokens == nil {
				if len(users.updates) != 0 {
					t.Fatalf("expected the balance untouched, got %+v", users.updates)
				}
				return
			}
			if len(users.updates) != 1 || users.updates[0]["tokens"] != test.wantTokens {
				t.Fatalf("expected tokens %v, got %+v", test.wantTokens, users.updates)
			}
		})
	}
}

func TestChargeExportReportsClerkFailures(t *testing.T) {
	resp := chargeExport(context.Background(), &fakeUsers{getErr: errors.New("clerk unavailable")}, "user_1", 10)
	if resp.StatusCode != 500 {
		t.Fatalf("expected 500, got %d", resp.StatusCode)
	}
}
