package repository

import (
	"database/sql"
	"log"
	"time"
)

type Expenses struct {
	ID      int       `json:"id"`
	UserId  int       `json:"user_id"`
	Type    string    `json:"type"`
	Amount  float64   `json:"amount"`
	Created time.Time `json:"created"`
	Updated time.Time `json:"updated"`
}

func CreateExpense(db *sql.DB, user_id int, expense_type string, amount float64) (int, error) {
	query := `INSERT INTO expense (user_id, exp_type, amount) VALUES ($1, $2, $3) RETURNING ID`
	var pk int
	err := db.QueryRow(query, user_id, expense_type, amount).Scan(&pk)
	if err != nil {
		log.Fatal(err)
	}
	return pk, nil
}

func GetExpenseByUserId(db *sql.DB, user_id int) ([]Expenses, error) {
	rows, err := db.Query("SELECT * FROM expense WHERE user_id=$1", user_id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var expenses []Expenses
	for rows.Next() {
		var data Expenses
		err := rows.Scan(&data.ID, &data.UserId, &data.Type, &data.Amount, &data.Created, &data.Updated)
		if err != nil {
			return nil, err
		}
		expenses = append(expenses, data)
	}
	return expenses, nil
}

func UpdateExpense(db *sql.DB, exp_type string, amount float64) (int64, error) {
	result, err := db.Exec("UPDATE expense SET amount=$1 WHERE exp_type=$2", amount, exp_type)
	if err != nil {
		return 0, err
	}
	rows, err := result.RowsAffected()
	return rows, nil
}

func DeleteExpense(db *sql.DB, id string) (int64, error) {
	result, err := db.Exec("DELETE FROM expense WHERE id=$1", id)
	if err != nil {
		return 0, err
	}

	rows, err := result.RowsAffected()
	return rows, nil
}
