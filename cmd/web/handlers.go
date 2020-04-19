package main

import (
	"net/http"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/favicon.ico" {
		http.Redirect(w, r, "/static/img/favicon.ico", http.StatusMovedPermanently)
		return
	}

	if r.URL.Path != "/" {
		app.notFound(w)
		return
	}

	if r.Method != http.MethodGet {
		w.Header().Set("Allow", http.MethodGet)
		app.clientError(w, http.StatusMethodNotAllowed)
		return
	}

	app.render(w, r, "home.page.tmpl", &templateData{
		Name:    "home",
		Styles:  []string{"home.css"},
		Scripts: []string{"pixi.min.js", "utils.js", "rectangle.js", "ball.js", "platform.js", "player.js", "run.js"},
	})
}

// TODO 'report-uri' is deprecated, switch to 'report-to'
func (app *application) csp(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		app.clientError(w, http.StatusMethodNotAllowed)
		return
	}

	type CSPReport struct {
		DocumentURI        string `json:"document-uri"`
		Referrer           string `json:"referrer"`
		BlockedURI         string `json:"blocked-uri"`
		ViolatedDirective  string `json:"violated-directive"`
		OriginalPolicy     string `json:"original-policy"`
		Disposition        string `json:"disposition"`
		EffectiveDirective string `json:"effective-directive"`
		LineNumber         int    `json:"line-number"`
		ScriptSample       string `json:"script-sample"`
		SourceFile         string `json:"source-file"`
		StatusCode         int    `json:"status-code"`
	}

	app.errorLog.Println(r.Body)

	w.Write([]byte("OK"))
}
