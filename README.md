# Expense Tracker

A full-stack mobile expense tracking application built with **React Native**, **Golang**, **PostgreSQL**, and **Docker**. The application helps users manage daily expenses by organizing transactions into categories while providing a scalable backend for future financial insights.

## Features

### Current Features

* Add new expenses
* View all recorded expenses
* Categorize expenses (Food, Travel, Housing, etc.)
* Filter expenses by category
* PostgreSQL database integration
* Dockerized backend environment

### In Progress

* User authentication (JWT-based)
* User profiles
* Salary management
* Savings tracking
* Financial analytics and insights

## Tech Stack

| Technology              | Purpose                                |
| ----------------------- | -------------------------------------- |
| React Native            | Mobile application                     |
| Golang                  | Backend API                            |
| PostgreSQL              | Database                               |
| Docker & Docker Compose | Containerization and local development |

## Project Structure

```text
expense-tracker/
├── backend/
├── frontend/
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

* Docker
* Docker Compose
* Go (optional for local backend development)
* Node.js
* React Native development environment

### Run the Backend

```bash
docker-compose up --build
```

The backend will start along with the PostgreSQL database.

## Roadmap

* [x] Expense CRUD
* [x] Expense categorization
* [x] Expense filtering
* [ ] User authentication
* [ ] User profiles
* [ ] Salary tracking
* [ ] Savings tracking
* [ ] Dashboard and analytics
* [ ] Budget planning

## Status

This project is currently under active development as part of my learning journey in full-stack mobile application development using Golang and React Native.
