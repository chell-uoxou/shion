package main

import (
	"fmt"
	"net/http"
	"os"
	"shion/handler/auth"
	"shion/handler/practice"
	"shion/handler/system"
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

	mux := http.NewServeMux()

	// DBを操作するrepositoryを初期化
	userRepo := postgres.NewUserRepository(postgres.DB)

	// repo必要なルーターを初期化
	practiceUserRouter := practice.NewPracticeUserRouter(userRepo)
	authCallbackRouter := auth.NewAuthCallbackRouter(userRepo)
	meRouter := auth.NewMeRouter(userRepo)

	// repo必要なハンドラを登録
	mux.HandleFunc("/callback", authCallbackRouter.AuthCallbackHandler)
	mux.HandleFunc("/practice/users", practiceUserRouter.PracticeUsersHandler)

	// 認証が必要なハンドラを登録
	mux.Handle("/me", middleware.RequireAuth(http.HandlerFunc(meRouter.MeHandler)))

	// repo不要なハンドラを登録
	mux.HandleFunc("/login", auth.LoginHandler)
	mux.HandleFunc("/health", system.HealthHandler)

	// mux 全体に CORS ミドルウェアを適用
	handler := middleware.WithCORS(mux, allowedOrigin)

	fmt.Printf("info: Listening on %s\n", SERVER_PORT)
	if err := http.ListenAndServe(SERVER_PORT, handler); err != nil {
		fmt.Println("error: Server failed:", err)
	}
}
