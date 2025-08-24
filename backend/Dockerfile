FROM golang:1.25.0
WORKDIR /app
RUN go install github.com/air-verse/air@latest
COPY . .
CMD ["air"]