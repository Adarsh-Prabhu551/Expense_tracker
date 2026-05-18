FROM golang:alpine

WORKDIR /app

COPY . .

RUN go build -o expense-tracker ./cmd/

CMD ["./expense-tracker"]