package handler

import (
	"encoding/json"
	"expenses/internal/repository"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func (h *Handler) CreateExpense(w http.ResponseWriter, r *http.Request) {
	var body struct {
		UserID      int     `json:"user_id"`
		Category    string  `json:"category"`
		Description string  `json:"description"`
		Amount      float64 `json:"amount"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	id, err := repository.CreateExpense(h.db, body.UserID, body.Category, body.Description, body.Amount)
	if err != nil {
		http.Error(w, "could not create expense", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]int{"id": id})
}

func (h *Handler) GetExpenseByUser(w http.ResponseWriter, r *http.Request) {
	userId, err := strconv.Atoi(chi.URLParam(r, "userId"))
	if err != nil {
		http.Error(w, "invalid expenses", http.StatusBadRequest)
		return
	}
	expenses, err := repository.GetExpenseByUserId(h.db, userId)
	if err != nil {
		http.Error(w, "could not fetch expenses", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(expenses)
}

func (h *Handler) UpdateExpense(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var body struct {
		Amount float64 `json:"amount"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}
	rows, err := repository.UpdateExpense(h.db, id, body.Amount)
	if err != nil || rows == 0 {
		http.Error(w, "could not update expense", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "updated"})
}

func (h *Handler) DeleteExpense(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	rows, err := repository.DeleteExpense(h.db, id)
	if err != nil || rows == 0 {
		http.Error(w, "could not delete expense", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
}
