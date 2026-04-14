package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"strings"
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
		fmt.Printf("Name: %v\n", users[i].Name)
		fmt.Printf("Income: %.2f\n", users[i].Income)
		var totalExpense float64
		for j := range users[i].Expense {
			totalExpense += users[i].Expense[j].Amount
			fmt.Printf("  Expense type: %v, amount: %.2f\n", users[i].Expense[j].Type, users[i].Expense[j].Amount)
		}
		fmt.Printf("Total expenses: %.2f\n", totalExpense)
		fmt.Printf("Net savings:    %.2f\n\n", users[i].Income-totalExpense)
	}
}

func search(username string, users []User) {
	found := false
	for i := range users {
		if users[i].Name == username {
			found = true
			fmt.Printf("Name: %v\n", users[i].Name)
			fmt.Printf("Income: %.2f\n", users[i].Income)
			var totalExpense float64
			for j := range users[i].Expense {
				totalExpense += users[i].Expense[j].Amount
				fmt.Printf("  Expense type: %v, amount: %.2f\n", users[i].Expense[j].Type, users[i].Expense[j].Amount)
			}
			fmt.Printf("Total expenses: %.2f\n", totalExpense)
			fmt.Printf("Net savings:    %.2f\n", users[i].Income-totalExpense)
		}
	}
	if !found {
		fmt.Printf("User '%v' not found.\n", username)
	}
}

func editExpense(username string, users []User, scanner *bufio.Scanner) []User {
	userFound := false
	for i := range users {
		if users[i].Name == username {
			userFound = true
			fmt.Println("Enter the expense type to edit:")
			scanner.Scan()
			expenseType := strings.TrimSpace(scanner.Text())

			typeFound := false
			for j := len(users[i].Expense) - 1; j >= 0; j-- {
				if users[i].Expense[j].Type == expenseType {
					typeFound = true
					fmt.Println("Enter 0 to edit or 1 to delete the expense:")
					scanner.Scan()
					var choice int
					fmt.Sscanf(scanner.Text(), "%d", &choice)
					switch choice {
					case 0:
						var amount float64
						fmt.Println("Enter the new amount:")
						scanner.Scan()
						fmt.Sscanf(scanner.Text(), "%f", &amount)
						users[i].Expense[j].Amount = amount
						fmt.Println("Expense updated.")
					case 1:
						users[i].Expense = append(users[i].Expense[:j], users[i].Expense[j+1:]...)
						fmt.Println("Expense deleted.")
					default:
						fmt.Println("Invalid choice.")
					}
					break
				}
			}
			if !typeFound {
				fmt.Printf("No expense of type '%v' found for user '%v'.\n", expenseType, username)
			}
		}
	}
	if !userFound {
		fmt.Printf("User '%v' not found.\n", username)
	}
	return users
}

func checkError(err error) {
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	}
}

func saveUsers(users []User) {
	file, err := os.Create("users.json")
	if err != nil {
		fmt.Printf("Error saving users: %v\n", err)
		return
	}
	defer file.Close()
	json.NewEncoder(file).Encode(&users)
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	users := []User{}

	data, err := os.ReadFile("users.json")
	if err == nil && len(data) > 0 {
		if jsonErr := json.Unmarshal(data, &users); jsonErr != nil {
			fmt.Printf("Warning: could not parse users.json: %v\n", jsonErr)
		}
	}

	for {
		fmt.Println("\nEnter your choice (for user): (0 to exit, 1 to add user)")
		scanner.Scan()
		var choice int
		fmt.Sscanf(scanner.Text(), "%d", &choice)
		if choice == 0 {
			break
		}

		fmt.Println("Enter your name:")
		scanner.Scan()
		name := strings.TrimSpace(scanner.Text())

		fmt.Println("Enter your income:")
		scanner.Scan()
		var income float64
		fmt.Sscanf(scanner.Text(), "%f", &income)

		users = append(users, User{Name: name, Income: income})
		length := len(users) - 1

		for {
			fmt.Println("Enter your choice (for expense): (0 to exit, 1 to add expense)")
			scanner.Scan()
			var choice2 int
			fmt.Sscanf(scanner.Text(), "%d", &choice2)
			if choice2 == 0 {
				break
			}

			fmt.Println("Enter the expense type:")
			scanner.Scan()
			expenseType := strings.TrimSpace(scanner.Text())

			fmt.Println("Enter the expense amount:")
			scanner.Scan()
			var amount float64
			fmt.Sscanf(scanner.Text(), "%f", &amount)

			users[length].Expense = append(users[length].Expense, Expenses{
				Type:   expenseType,
				Amount: amount,
			})
		}
	}

	saveUsers(users)

	fmt.Println("\n--- All User Details ---")
	display(users)

	fmt.Println("Enter the username to search:")
	scanner.Scan()
	username := strings.TrimSpace(scanner.Text())
	search(username, users)

	fmt.Println("\nEnter the username to edit an expense:")
	scanner.Scan()
	username = strings.TrimSpace(scanner.Text())
	users = editExpense(username, users, scanner)

	saveUsers(users)
	fmt.Println("\n--- Updated User Details ---")
	display(users)
}
