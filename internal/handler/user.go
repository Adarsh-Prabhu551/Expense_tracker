package handler

import (
	"database/sql"
	"encoding/json"
	"expenses/internal/repository"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type Handler struct {
	db *sql.DB
}

func New(db *sql.DB) *Handler {
	return &Handler{db: db}
}

func (h *Handler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Name   string  `json:"name"`
		Income float64 `json:"income"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}
	id, err := repository.CreateUsers(h.db, body.Name, body.Income)
	if err != nil {
		http.Error(w, "could not create user", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]int{"id": id})
}

func (h *Handler) GetUser(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}
	user, err := repository.GetUserByID(h.db, id)
	if err != nil {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(user)
}

func (h *Handler) LoginUser(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
	}
	user, err := repository.GetUserName(h.db, body.Name)
	if err != nil {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(map[string]int{"id": user.ID})
}
