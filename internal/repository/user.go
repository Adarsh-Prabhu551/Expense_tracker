package repository

import (
	"database/sql"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID       int       `json:"id"`
	Name     string    `json:"name"`
	Income   float64   `json:"income"`
	Created  time.Time `json:"created"`
	Updated  time.Time `json:"updated"`
	Email    string    `json:"email"`
	Password string    `json:"-"`
}

func CreateUsers(db *sql.DB, name string, income float64, email string, password string) (int, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return 0, err
	}

	query := `INSERT INTO users (name, income, email, password_hash)
	    VALUES ($1, $2, $3, $4) RETURNING id`
	var pk int
	err = db.QueryRow(query, name, income, email, string(hash)).Scan(&pk)
	if err != nil {
		return 0, err
	}
	return pk, nil
}

func GetUserByID(db *sql.DB, id int) (User, error) {
	var u User
	err := db.QueryRow("SELECT * FROM users WHERE id=$1", id).Scan(&u.ID, &u.Name, &u.Income, &u.Created, &u.Updated)
	if err != nil {
		return User{}, err
	}
	return u, nil
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
			return nil, err
		}
		user = append(user, us)
	}
	if err = rows.Err(); err != nil {
		return user, err
	}
	return user, nil

}

func GetUserByEmail(db *sql.DB, email string) (User, error) {
	var u User
	err := db.QueryRow("SELECT id, name, income, created, updated, email, password_hash FROM users WHERE email=$1", email).Scan(&u.ID, &u.Name, &u.Income, &u.Created, &u.Updated, &u.Email, &u.Password)
	if err != nil {
		return User{}, err
	}

	return u, err
}
