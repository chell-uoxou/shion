package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

const SERVER_PORT = ":8080"

var allowedOrigin = os.Getenv("ALLOWED_FRONTEND_ORIGIN")

// CORS ミドルウェア
func withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("health 叩かれた！")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(map[string]string{
		"status":  "ok",
		"message": "うごいてるよ",
	})
}

func main() {
	fmt.Println("Launching shion backend...")

	if allowedOrigin == "" {
		fmt.Println("warn: ALLOWED_FRONTEND_ORIGIN is not set")
	} else {
		fmt.Println("info: ALLOWED_FRONTEND_ORIGIN is set to", allowedOrigin)
	}

	http.HandleFunc("/health", withCORS(healthHandler))

	fmt.Printf("Listening on %s\n", SERVER_PORT)

	if err := http.ListenAndServe(SERVER_PORT, nil); err != nil {
		fmt.Println("Server failed:", err)
	}

}
