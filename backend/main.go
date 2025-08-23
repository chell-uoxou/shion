package main

import (
	"fmt"
	"net/http"
	"os"
	"shion/handler"
	"shion/middleware"
	"shion/repository/postgres"

	_ "github.com/lib/pq"
)

const SERVER_PORT = ":8080"

var allowedOrigin = os.Getenv("ALLOWED_FRONTEND_ORIGIN")

func main() {
	fmt.Println("info: Launching shion backend...")

	if allowedOrigin == "" {
		fmt.Println("warn: ALLOWED_FRONTEND_ORIGIN is not set")
	} else {
		fmt.Println("info: ALLOWED_FRONTEND_ORIGIN is set to", allowedOrigin)
	}

	err := postgres.InitDB()
	if err != nil {
		fmt.Println("error: Database connection failed:", err)
		return
	}

	defer postgres.DB.Close()

	userRepo := postgres.NewUserRepository(postgres.DB)

	practiceUserRouter := handler.NewPracticeUserRouter(userRepo)

	mux := http.NewServeMux()
	mux.HandleFunc("/login", handler.LoginHandler)
	mux.HandleFunc("/callback", handler.AuthCallbackHandler)
	mux.HandleFunc("/health", handler.HealthHandler)
	mux.HandleFunc("/practice/users", practiceUserRouter.PracticeUsersHandler)

	// mux 全体に CORS ミドルウェアを適用
	handler := middleware.WithCORS(mux, allowedOrigin)

	fmt.Printf("info: Listening on %s\n", SERVER_PORT)
	if err := http.ListenAndServe(SERVER_PORT, handler); err != nil {
		fmt.Println("error: Server failed:", err)
	}
}
