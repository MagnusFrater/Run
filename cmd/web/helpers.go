package main

import (
	"bytes"
	"fmt"
	"net/http"
	"runtime/debug"
)

func (app *application) serveError(w http.ResponseWriter, err error) {
	trace := fmt.Sprintf("%s\n%s", err.Error(), debug.Stack())
	app.errorLog.Output(2, trace)
	http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
}

func (app *application) clientError(w http.ResponseWriter, status int) {
	http.Error(w, http.StatusText(status), status)
}

func (app *application) notFound(w http.ResponseWriter) {
	app.clientError(w, http.StatusNotFound)
}

func (app *application) addDefaultData(td *templateData, r *http.Request) *templateData {
	if td == nil {
		td = &templateData{}
	}

	td.LanguageCode = "en"
	td.CountryCode = "US"
	td.Charset = "utf-8"
	td.Description = "The personal website of Todd Everett Griffin"
	td.Author = "Todd Everett Griffin"
	td.HomeURL = "https://www.toddgriffin.me"
	td.Keywords = []string{
		"Todd", "Everett", "Griffin",
		"personal", "website",
	}
	td.ThemeColor = "#f7cb64"

	styles := []string{"base.css"}
	td.Styles = append(styles, td.Styles...)

	return td
}

func (app *application) render(w http.ResponseWriter, r *http.Request, name string, td *templateData) {
	ts, ok := app.templateCache[name]
	if !ok {
		app.serveError(w, fmt.Errorf("The template %s does not exist", name))
		return
	}

	// write template to buffer to catch templating errors
	buf := new(bytes.Buffer)
	err := ts.Execute(buf, app.addDefaultData(td, r))
	if err != nil {
		app.serveError(w, err)
		return
	}
	buf.WriteTo(w)
}
