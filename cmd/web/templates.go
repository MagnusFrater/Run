package main

import (
	"html/template"
	"path/filepath"
)

type (
	templateData struct {
		// global
		LanguageCode string
		CountryCode  string
		Charset      string
		Description  string
		Author       string
		HomeURL      string
		Keywords     []string
		ThemeColor   string

		// page specific
		Name    string
		Styles  []string
		Scripts []string
	}
)

func newTemplateCache(dir string) (map[string]*template.Template, error) {
	var functions = template.FuncMap{
		// "capitalize": strings.ToUpper,
	}

	cache := map[string]*template.Template{}

	pages, err := filepath.Glob(filepath.Join(dir, "html/*.page.tmpl"))
	if err != nil {
		return nil, err
	}

	for _, page := range pages {
		name := filepath.Base(page)

		ts, err := template.New(name).Funcs(functions).ParseFiles(page)
		if err != nil {
			return nil, err
		}

		ts, err = ts.ParseGlob(filepath.Join(dir, "html/*.layout.tmpl"))
		if err != nil {
			return nil, err
		}

		ts, err = ts.ParseGlob(filepath.Join(dir, "html/*.partial.tmpl"))
		if err != nil {
			return nil, err
		}

		cache[name] = ts
	}

	return cache, nil
}
