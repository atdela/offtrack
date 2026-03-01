package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"strings"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/mac/offtrack/graph"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

//go:embed all:ui/dist
var uiDist embed.FS

func main() {
	app := pocketbase.New()

	// Register custom routes
	app.OnServe().BindFunc(func(e *core.ServeEvent) error {
		// Create GraphQL handler
		srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{App: app}}))

		// Register GraphQL endpoint
		graphqlHandler := func(c *core.RequestEvent) error {
			srv.ServeHTTP(c.Response, c.Request)
			return nil
		}
		e.Router.GET("/graphql", graphqlHandler)
		e.Router.POST("/graphql", graphqlHandler)

		// Register GraphQL playground (optional, good for dev)
		e.Router.GET("/playground", func(c *core.RequestEvent) error {
			playground.Handler("GraphQL playground", "/graphql").ServeHTTP(c.Response, c.Request)
			return nil
		})

		// Serve embedded frontend
		sub, err := fs.Sub(uiDist, "ui/dist")
		if err != nil {
			return err
		}

		// Register static file server for the assets
		e.Router.GET("/assets/{path...}", apis.Static(sub, false))

		// Use a middleware to handle SPA fallback for non-existent routes
		e.Router.BindFunc(func(c *core.RequestEvent) error {
			err := c.Next()

			// If not found and it's a GET request for a potential UI route
			if err != nil && c.Request.Method == http.MethodGet {
				if apiErr := apis.ToApiError(err); apiErr.Status == http.StatusNotFound {
					path := c.Request.URL.Path
					// Avoid intercepting API or static assets that really are missing
					if !strings.HasPrefix(path, "/api/") && !strings.HasPrefix(path, "/assets/") &&
						path != "/graphql" && path != "/playground" {
						data, err := fs.ReadFile(sub, "index.html")
						if err == nil {
							return c.HTML(http.StatusOK, string(data))
						}
					}
				}
			}

			return err
		})

		// Serve index.html for the root specifically if it wasn't matched
		e.Router.GET("/", func(c *core.RequestEvent) error {
			data, err := fs.ReadFile(sub, "index.html")
			if err != nil {
				return err
			}
			return c.HTML(http.StatusOK, string(data))
		})

		return e.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
