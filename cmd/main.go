package main

import (
	"expenses/internal/db"
	"expenses/internal/handler"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main() {
	conn, err := db.Connect()
	if err != nil {
		log.Fatal(err)
	}
	h := handler.New(conn)
	r := chi.NewRouter()

	r.Use(cors.AllowAll().Handler)

	r.Route("/users", func(r chi.Router) {
		r.Post("/signup", h.CreateUser)
		r.Post("/login", h.LoginUser)
		r.Get("/{id}", h.GetUser)
	})

	r.Route("/expenses", func(r chi.Router) {
		r.Post("/", h.CreateExpense)
		r.Get("/user/{userId}", h.GetExpenseByUser)
		r.Put("/{id}", h.UpdateExpense)
		r.Delete("/{id}", h.DeleteExpense)
	})

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
