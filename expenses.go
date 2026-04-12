package main

import (
	"encoding/json"
	"fmt"
	"os"
)

type Expenses struct {
	Type   string
	Amount float64
}

type User struct {
	Name    string
	Income  float64
	Expense []Expenses
}

func display(users []User) {
	for i := range users {
		fmt.Printf("Name:%v\n", users[i].Name)
		fmt.Printf("Income:%.2f\n", users[i].Income)
		var totalExpense float64
		for j := range users[i].Expense {
			totalExpense += users[i].Expense[j].Amount
			fmt.Printf("Expense type:%v, amount:%v\n", users[i].Expense[j].Type, users[i].Expense[j].Amount)
		}
		fmt.Printf("Total expenses:%.2f", totalExpense)
		fmt.Println()
	}
}

func search(username string, users []User) {
	for i := range users {
		if users[i].Name == username {
			fmt.Printf("Name:%v\n", users[i].Name)
			fmt.Printf("Income:%.2f\n", users[i].Income)
			for j := range users[i].Expense {
				fmt.Printf("Expense type:%v, amount:%v\n", users[i].Expense[j].Type, users[i].Expense[j].Amount)
			}
		}
	}
}

func editExpense(username string, users []User) {
	for i := range users {
		if users[i].Name == username {
			var expenseType string
			fmt.Println("Enter the type:")
			fmt.Scan(&expenseType)
			for j := range users[i].Expense {
				if users[i].Expense[j].Type == expenseType {
					var amount float64
					var choice int
					fmt.Println("Enter 0 to edit and 1 to delete the expense")
					fmt.Scan(&choice)
					switch choice {
					case 0:
						fmt.Println("Enter the new amount:")
						fmt.Scan(&amount)
						users[i].Expense[j].Amount = amount
						break
					case 1:
						users[i].Expense = append(users[i].Expense[:j], users[i].Expense[j+1:]...)
						break
					default:
						break
					}
				}
			}

		}
	}
}

// CLI Expense Tracker
func main() {
	users := []User{}
	data, err := os.ReadFile("users.json")
	if err == nil { // File exists and is readable
		json.Unmarshal(data, &users)
	}

	for {
		var name string
		var choice int
		fmt.Println("Enter your choice (for user):(0 to exit)")
		fmt.Scan(&choice)
		if choice == 0 {
			break
		}

		fmt.Println("Welcome.Enter your name")
		fmt.Scan(&name)

		var income float64
		fmt.Println("\nProgram: Enter your income")
		fmt.Scan(&income)

		users = append(users, User{Name: name, Income: income})
		length := len(users) - 1

		var choice2 int
		for {
			fmt.Println("Enter your choice (for expense):(0 to exit)")
			fmt.Scan(&choice2)
			if choice2 == 0 {
				break
			}

			var expenseType string
			var amount float64
			fmt.Println("Enter the expenses type:")
			fmt.Scan(&expenseType)
			fmt.Println("Enter the expense amount:")
			fmt.Scan(&amount)

			users[length].Expense = append(users[length].Expense, Expenses{
				Type:   expenseType,
				Amount: amount,
			})
		}
		choice2 = 1

	}
	file, _ := os.Create("users.json")
	json.NewEncoder(file).Encode(&users)
	file.Close()
	fmt.Println("User details:")
	display(users)

	var username string
	fmt.Println("Enter the user to search")
	fmt.Scan(&username)
	search(username, users)

	fmt.Println("Enter the username to edit the expense:")
	fmt.Scan(&username)
	editExpense(username, users)
}
