package main

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestSecureHeaders(t *testing.T) {
	t.Parallel()

	rr := httptest.NewRecorder()
	r, err := http.NewRequest(http.MethodGet, "/", nil)
	if err != nil {
		t.Fatal(err)
	}

	// mock HTTP handler that we can pass to our secureHeaders middleware
	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	secureHeaders(next).ServeHTTP(rr, r)
	resp := rr.Result()

	testCases := []struct {
		name   string
		header string
	}{
		{"Content-Security-Policy", contentSecurityPolicy},
		{"Strict-Transport-Security", "max-age=31536000; includeSubDomains"},
		{"X-Content-Type-Options", "nosniff"},
		{"X-Frame-Options", "SAMEORIGIN"},
		{"X-XSS-Protection", "1; mode=block"},
	}

	// test headers
	for _, tc := range testCases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			header := resp.Header.Get(tc.name)
			if header != tc.header {
				t.Errorf("Expected: %s\tActual: %s\n", tc.header, header)
			}
		})
	}

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected: %d\tActual: %d\n", http.StatusOK, resp.StatusCode)
	}

	defer resp.Body.Close()
	buf, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		t.Fatal(err)
	}

	body := string(buf)
	if body != "OK" {
		t.Errorf("Expected: %s\tActual: %s\n", "OK", body)
	}
}
