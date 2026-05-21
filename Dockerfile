FROM golang:alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o expense-tracker ./cmd/

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/expense-tracker .

CMD ["./expense-tracker"]