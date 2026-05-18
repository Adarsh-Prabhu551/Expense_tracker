package repository

import (
	"database/sql"
	"log"
	"time"
)

type User struct {
	ID      int
	Name    string
	Income  float64
	Created time.Time
	Updated time.Time
}

func CreateUsers(db *sql.DB, name string, income float64) (int, error) {
	query := `INSERT INTO users (name, income)
	    VALUES ($1, $2) RETURNING id`
	var pk int
	err := db.QueryRow(query, name, income).Scan(&pk)
	if err != nil {
		log.Fatal(err)
	}
	return pk, nil
}

func GetAllUsers(db *sql.DB) ([]User, error) {
	rows, err := db.Query("SELECT * FROM users")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var user []User

	for rows.Next() {
		var us User
		if err := rows.Scan(&us.ID, &us.Name, &us.Income, &us.Created, &us.Updated); err != nil {
			log.Fatal(err)
		}
		user = append(user, us)
	}
	if err = rows.Err(); err != nil {
		return user, err
	}
	return user, nil

}

func GetUserName(db *sql.DB, name string) (User, error) {
	var data User
	err := db.QueryRow("SELECT * FROM users WHERE name=$1", name).Scan(&data.ID, &data.Name, &data.Income, &data.Created, &data.Updated)
	if err != nil {
		return User{}, err
	}

	return data, nil
}
