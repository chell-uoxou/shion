package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"shion/handler"
	"shion/repository/postgres"

	_ "github.com/lib/pq"
)

const SERVER_PORT = ":8080"

var allowedOrigin = os.Getenv("ALLOWED_FRONTEND_ORIGIN")

// CORS ミドルウェア
func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if allowedOrigin != "" {
			w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		}
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Vary", "Origin")

		// プリフライトリクエストはここで終了
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("health 叩かれた！")

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "ok",
		"message": "うごいてるよ",
	})
}

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

	practiceUseRouter := handler.NewPracticeUserRouter(userRepo)

	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/practice/users", practiceUseRouter.GetPracticeUsersHandler)

	// mux 全体に CORS ミドルウェアを適用
	handler := withCORS(mux)

	fmt.Printf("info: Listening on %s\n", SERVER_PORT)
	if err := http.ListenAndServe(SERVER_PORT, handler); err != nil {
		fmt.Println("error: Server failed:", err)
	}
}
