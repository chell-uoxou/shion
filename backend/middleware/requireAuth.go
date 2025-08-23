package middleware

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"shion/repository/postgres"

	"github.com/golang-jwt/jwt/v5"
)

type AuthClaims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

type contextKey string

const (
	userContextKey   = contextKey("user")
	claimsContextKey = contextKey("claims")
)

// RequireAuth ミドルウェア
func RequireAuth(userRepo *postgres.UserRepository, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("app_token")
		if err != nil {
			http.Error(w, "unauthorized: missing token", http.StatusUnauthorized)
			return
		}

		// JWT 検証
		token, err := jwt.ParseWithClaims(cookie.Value, &AuthClaims{RegisteredClaims: jwt.RegisteredClaims{}}, func(t *jwt.Token) (interface{}, error) {
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

		// DBでユーザー解決（google_sub → users.id）
		user, err := userRepo.GetUserByGoogleSub(claims.Subject)
		if err != nil || user == nil {
			http.Error(w, "unauthorized: user not found", http.StatusUnauthorized)
			return
		}

		// context に両方入れる
		ctx := r.Context()
		ctx = context.WithValue(ctx, claimsContextKey, claims)
		ctx = context.WithValue(ctx, userContextKey, user)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// ヘルパー: ハンドラからユーザー情報を取り出す
func GetAuthClaims(r *http.Request) (*AuthClaims, error) {
	claims, ok := r.Context().Value(claimsContextKey).(*AuthClaims)
	if !ok {
		return nil, fmt.Errorf("no auth claims in context")
	}
	return claims, nil
}

func GetAuthUser(r *http.Request) (*postgres.User, error) {
	user, ok := r.Context().Value(userContextKey).(*postgres.User)
	if !ok {
		return nil, fmt.Errorf("no auth user in context")
	}
	return user, nil
}
