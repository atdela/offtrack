package main

import (
	"log"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/mac/offtrack/graph"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func main() {
	app := pocketbase.New()

	// Register custom routes
	app.OnServe().BindFunc(func(e *core.ServeEvent) error {
		// Create GraphQL handler
		srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{App: app}}))

		// Register GraphQL endpoint
		e.Router.Any("/graphql", func(c *core.RequestEvent) error {
			srv.ServeHTTP(c.Response, c.Request)
			return nil
		})

		// Register GraphQL playground (optional, good for dev)
		e.Router.GET("/playground", func(c *core.RequestEvent) error {
			playground.Handler("GraphQL playground", "/graphql").ServeHTTP(c.Response, c.Request)
			return nil
		})

		return e.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
