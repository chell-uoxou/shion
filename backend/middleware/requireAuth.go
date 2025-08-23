package middleware

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt/v5"
)

type AuthClaims struct {
	UserID string `json:"sub"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

type contextKey string

const userContextKey = contextKey("user")

// RequireAuth ミドルウェア
func RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("app_token")
		if err != nil {
			http.Error(w, "unauthorized: missing token", http.StatusUnauthorized)
			return
		}

		// JWT の検証
		token, err := jwt.ParseWithClaims(cookie.Value, &AuthClaims{}, func(t *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})
		if err != nil || !token.Valid {
			http.Error(w, "unauthorized: invalid token", http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(*AuthClaims)
		if !ok {
			http.Error(w, "unauthorized: bad claims", http.StatusUnauthorized)
			return
		}

		fmt.Printf("Authenticated user: %v\n", claims)

		// ユーザー情報を context に埋め込む
		ctx := context.WithValue(r.Context(), userContextKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// ヘルパー: ハンドラからユーザー情報を取り出す
func GetAuthUser(r *http.Request) (*AuthClaims, error) {
	claims, ok := r.Context().Value(userContextKey).(*AuthClaims)
	if !ok {
		return nil, fmt.Errorf("no auth user in context")
	}
	return claims, nil
}
