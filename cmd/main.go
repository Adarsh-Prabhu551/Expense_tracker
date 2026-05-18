package main

import (
	"bufio"
	"database/sql"
	"expenses/internal/db"
	"expenses/internal/repository"
	"fmt"
	"log"
	"os"
	"strings"
)

func display(conn *sql.DB, users []repository.User) {
	for i := range users {
		fmt.Printf("Name: %v\n", users[i].Name)
		fmt.Printf("Income: %.2f\n", users[i].Income)

		var totalExpense float64
		expense, err := repository.GetExpenseByUserId(conn, users[i].ID)
		checkError(err)

		for j := range expense {
			totalExpense += expense[j].Amount
			fmt.Printf("  Expense type: %v, amount: %.2f\n", expense[j].Type, expense[j].Amount)
		}
		fmt.Printf("Total expenses: %.2f\n", totalExpense)
		fmt.Printf("Net savings:    %.2f\n\n", users[i].Income-totalExpense)
	}
}

func search(conn *sql.DB, users repository.User) {
	fmt.Println("ID \t Name \t Income \t Created \t Updated ")
	fmt.Println(users.ID, "\t", users.Name, "\t", users.Income, "\t", users.Created, "\t", users.Updated)

	expense, err := repository.GetExpenseByUserId(conn, users.ID)
	checkError(err)

	var totalExpense float64
	for j := range expense {
		totalExpense += expense[j].Amount
		fmt.Printf("  Expense type: %v, amount: %.2f\n", expense[j].Type, expense[j].Amount)
	}
	fmt.Printf("Total expenses: %.2f\n", totalExpense)
	fmt.Printf("Net savings:    %.2f\n", users.Income-totalExpense)
}

func editExpense(conn *sql.DB, users repository.User, scanner *bufio.Scanner) {
	fmt.Println("Enter the expense type to edit:")
	scanner.Scan()
	expenseType := strings.TrimSpace(scanner.Text())

	typeFound := false
	expense, err := repository.GetExpenseByUserId(conn, users.ID)
	checkError(err)

	for j := range expense {
		if expense[j].Type == expenseType {
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
				repository.UpdateExpense(conn, expenseType, amount)
				fmt.Println("Expense updated.")
			case 1:
				repository.DeleteExpense(conn, expenseType)
				fmt.Println("Expense deleted.")
			default:
				fmt.Println("Invalid choice.")
			}
			break
		}
	}
	if !typeFound {
		fmt.Printf("No expense of type '%v' found for user '%v'.\n", expenseType, users.Name)
	}
}

func checkError(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)

	conn, err := db.Connect()
	checkError(err)

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

		user_id, err := repository.CreateUsers(conn, name, income)
		checkError(err)

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

			repository.CreateExpense(conn, user_id, expenseType, amount)
		}
	}

	fmt.Println("\n--- All User Details ---")
	users, err1 := repository.GetAllUsers(conn)
	checkError(err1)
	display(conn, users)

	fmt.Println("Enter the username to search:")
	scanner.Scan()
	username := strings.TrimSpace(scanner.Text())
	data, err2 := repository.GetUserName(conn, username)
	checkError(err2)
	search(conn, data)

	fmt.Println("\nEnter the username to edit an expense:")
	scanner.Scan()
	username = strings.TrimSpace(scanner.Text())
	data, err3 := repository.GetUserName(conn, username)
	checkError(err3)
	editExpense(conn, data, scanner)

	fmt.Println("\n--- Updated User Details ---")
	users1, err4 := repository.GetAllUsers(conn)
	checkError(err4)
	display(conn, users1)
}
