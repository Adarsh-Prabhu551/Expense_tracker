package main

import "fmt"

type Expenses struct {
	Type   string
	Amount float64
}

type User struct {
	Name    string
	Income  float64
	Expense []Expenses
}

// CLI Expense Tracker
func main() {
	users := make([]User, 2)
	for i := 0; i < 2; i++ {
		var name string
		fmt.Println("Welcome.Enter your name")
		fmt.Scan(&name)
		users[i].Name = name

		fmt.Printf("User: %v", users[i].Name)

		var income float64
		fmt.Println("\nProgram: Enter your income")
		fmt.Scan(&income)
		users[i].Income = income

	}
}
