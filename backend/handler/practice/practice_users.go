package practice

import (
	"encoding/json"
	"fmt"
	"net/http"
	"shion/repository/postgres"
	"time"
)

type UserResponse struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	AvatarUrl string    `json:"avatar_url"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type PracticeUserRouter struct {
	repo *postgres.UserRepository
}

func NewPracticeUserRouter(repo *postgres.UserRepository) *PracticeUserRouter {
	return &PracticeUserRouter{repo: repo}
}

func (router *PracticeUserRouter) PracticeUsersHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("info: Handling GetPracticeUsers request")

	w.Header().Set("Content-Type", "application/json")
	dbUsers, err := router.repo.GetAllUsers()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// DBのユーザー型をハンドラ用のUser型に変換
	users := make([]UserResponse, len(dbUsers))

	for i, u := range dbUsers {
		fmt.Println("info: Retrieved user:", u.Name)
		users[i] = UserResponse{
			ID:        u.ID,
			Name:      u.Name,
			AvatarUrl: u.AvatarUrl.String,
			CreatedAt: u.CreatedAt,
			UpdatedAt: u.UpdatedAt,
		}
	}

	// JSONで返却
	if err := json.NewEncoder(w).Encode(users); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
