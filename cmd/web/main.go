package main

import (
	"flag"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"time"
)

type application struct {
	errorLog      *log.Logger
	infoLog       *log.Logger
	templateCache map[string]*template.Template
}

func main() {
	addr := flag.String("addr", "80", "HTTP network address")
	flag.Parse()

	app := &application{
		errorLog: log.New(os.Stderr, "ERROR\t", log.Ldate|log.Ltime|log.Lshortfile),
		infoLog:  log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime),
	}

	templateCache, err := newTemplateCache("./ui/")
	if err != nil {
		app.errorLog.Fatal(err)
	}
	app.templateCache = templateCache

	// default port to OS ENV, otherwise command-line flag
	port := os.Getenv("PORT")
	if port == "" {
		port = *addr
	}

	srv := &http.Server{
		Addr:     fmt.Sprintf(":%s", port),
		ErrorLog: app.errorLog,
		Handler:  app.routes(),

		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	app.infoLog.Printf("Starting server on %s\n", srv.Addr)
	err = srv.ListenAndServe()
	app.errorLog.Fatal(err)
}
