package auth

import (
	"encoding/json"
	"fmt"
	"net/http"
	"shion/middleware"
	"shion/repository/postgres"
	"time"
)

type MeResponse struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	AvatarUrl string    `json:"avatar_url"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type MeRouter struct {
	repo *postgres.UserRepository
}

func NewMeRouter(repo *postgres.UserRepository) *MeRouter {
	return &MeRouter{repo: repo}
}

func (router *MeRouter) MeHandler(w http.ResponseWriter, r *http.Request) {
	// 認証情報を context から取り出す
	claims, err := middleware.GetAuthUser(r)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	fmt.Printf("Auth claims in /me: %s\n", claims.Subject)

	user, err := router.repo.GetUserByGoogleSub(claims.Subject)
	fmt.Printf("Fetched user from DB: %v\n", user)

	if err != nil {
		http.Error(w, "server error", http.StatusInternalServerError)
		return
	}
	if user == nil {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}

	// レスポンスを作成
	resp := MeResponse{
		ID:        user.ID,
		Name:      user.Name,
		AvatarUrl: user.AvatarUrl.String,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}

	// JSONを返す
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
