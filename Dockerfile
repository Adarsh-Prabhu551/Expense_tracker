FROM golang:alpine

WORKDIR /app

COPY . .
RUN go build -o expense-tracker .
CMD ["./expense-tracker"]