package repository

import (
	"database/sql"
	"time"
)

type Expenses struct {
	ID          int       `json:"id"`
	UserId      int       `json:"user_id"`
	Category    string    `json:"category"`
	Description string    `json:"description"`
	Amount      float64   `json:"amount"`
	Created     time.Time `json:"created"`
	Updated     time.Time `json:"updated"`
}

func CreateExpense(db *sql.DB, user_id int, category string, description string, amount float64) (int, error) {
	query := `INSERT INTO expenses (user_id, category, exp_description, amount) VALUES ($1, $2, $3, $4) RETURNING ID`
	var pk int
	err := db.QueryRow(query, user_id, category, description, amount).Scan(&pk)
	if err != nil {
		return 0, err
	}
	return pk, nil
}

func GetExpenseByUserId(db *sql.DB, user_id int) ([]Expenses, error) {
	rows, err := db.Query("SELECT * FROM expenses WHERE user_id=$1", user_id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var expenses []Expenses
	for rows.Next() {
		var data Expenses
		err := rows.Scan(&data.ID, &data.UserId, &data.Category, &data.Description, &data.Amount, &data.Created, &data.Updated)
		if err != nil {
			return nil, err
		}
		expenses = append(expenses, data)
	}
	return expenses, nil
}

func UpdateExpense(db *sql.DB, id string, amount float64) (int64, error) {
	result, err := db.Exec("UPDATE expenses SET amount=$1 WHERE id=$2", amount, id)
	if err != nil {
		return 0, err
	}
	rows, err := result.RowsAffected()
	return rows, nil
}

func DeleteExpense(db *sql.DB, id string) (int64, error) {
	result, err := db.Exec("DELETE FROM expenses WHERE id=$1", id)
	if err != nil {
		return 0, err
	}

	rows, err := result.RowsAffected()
	return rows, nil
}
