package main

import (
	"fmt"
	"net/http"
)

// TODO track bug: https://bugs.chromium.org/p/chromium/issues/detail?id=271452
// remove 'unsafe-inline' from style-src
const contentSecurityPolicy = `
default-src 'unsafe-eval';
style-src 'self' 'unsafe-inline' 'report-sample';
script-src-elem 'self' 'report-sample';
img-src 'self' 'report-sample';
object-src 'self';
base-uri 'self' 'report-sample';
form-action 'none';
plugin-types application/pdf;
frame-src 'self';
frame-ancestors 'self';
navigate-to 'self' 'report-sample';
upgrade-insecure-requests;
block-all-mixed-content;
report-uri /csp-report;`

func secureHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Security-Policy", contentSecurityPolicy)
		w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "SAMEORIGIN")
		w.Header().Set("X-XSS-Protection", "1; mode=block")

		next.ServeHTTP(w, r)
	})
}

func (app *application) logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		app.infoLog.Printf("%s - %s %s %s", r.RemoteAddr, r.Proto, r.Method, r.URL.RequestURI())

		next.ServeHTTP(w, r)
	})
}

func (app *application) recoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				w.Header().Set("Connection", "close")
				app.serveError(w, fmt.Errorf("%s", err))
			}
		}()

		next.ServeHTTP(w, r)
	})
}
