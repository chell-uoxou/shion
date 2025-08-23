package resource

import (
	"encoding/json"
	"net/http"
	"shion/middleware"
	"shion/repository/postgres"
	"strconv"
	"time"
)

type FriendRouter struct {
	friendRepo *postgres.FriendRepository
	userRepo   *postgres.UserRepository
}

func NewFriendRouter(repoFriend *postgres.FriendRepository, repoUser *postgres.UserRepository) *FriendRouter {
	return &FriendRouter{friendRepo: repoFriend, userRepo: repoUser}
}

func (r *FriendRouter) Register(mux *http.ServeMux) {
	// /friends 一覧と新規作成（認証必須）
	mux.Handle("/friends", middleware.RequireAuth(r.userRepo, http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		switch req.Method {
		case http.MethodGet:
			r.List(w, req)
		case http.MethodPost:
			r.Create(w, req)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})))

	// /friends/:id 個別取得・更新・削除（認証必須）
	mux.Handle("/friends/", middleware.RequireAuth(r.userRepo, http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		idStr := req.URL.Path[len("/friends/"):]
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "invalid id", http.StatusBadRequest)
			return
		}

		switch req.Method {
		case http.MethodGet:
			r.Get(w, req, id)
		case http.MethodPut:
			r.Update(w, req, id)
		case http.MethodDelete:
			r.Delete(w, req, id)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})))
}

// --- Handlers ---

// GET /friends
func (r *FriendRouter) List(w http.ResponseWriter, req *http.Request) {
	user, err := middleware.GetAuthUser(req)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	friends, err := r.friendRepo.List(user.ID)
	if err != nil {
		http.Error(w, "failed to fetch friends", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(friends)
}

// POST /friends
func (r *FriendRouter) Create(w http.ResponseWriter, req *http.Request) {
	user, err := middleware.GetAuthUser(req)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var body struct {
		DisplayName  string    `json:"display_name"`
		Note         string    `json:"note"`
		AvatarColor  string    `json:"avatar_color"`
		AvatarIcon   string    `json:"avatar_icon"`
		LastSelected time.Time `json:"last_selected_at"`
	}
	if err := json.NewDecoder(req.Body).Decode(&body); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	friend, err := r.friendRepo.Create(user.ID, body.DisplayName, body.Note, body.AvatarColor, body.AvatarIcon, body.LastSelected)
	if err != nil {
		http.Error(w, "failed to create friend", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(friend)
}

// GET /friends/:id
func (r *FriendRouter) Get(w http.ResponseWriter, req *http.Request, id int) {
	user, err := middleware.GetAuthUser(req)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	friend, err := r.friendRepo.Get(id)
	if err != nil {
		http.Error(w, "friend not found", http.StatusNotFound)
		return
	}

	if friend.CreatedBy != user.ID {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(friend)
}

// PUT /friends/:id
func (r *FriendRouter) Update(w http.ResponseWriter, req *http.Request, id int) {
	user, err := middleware.GetAuthUser(req)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var body struct {
		DisplayName  string    `json:"display_name"`
		Note         string    `json:"note"`
		AvatarColor  string    `json:"avatar_color"`
		AvatarIcon   string    `json:"avatar_icon"`
		LastSelected time.Time `json:"last_selected_at"`
	}
	if err := json.NewDecoder(req.Body).Decode(&body); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	friend, err := r.friendRepo.Get(id)
	if err != nil {
		http.Error(w, "friend not found", http.StatusNotFound)
		return
	}
	if friend.CreatedBy != user.ID {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	updated, err := r.friendRepo.Update(id, body.DisplayName, body.Note, body.AvatarColor, body.AvatarIcon, body.LastSelected)
	if err != nil {
		http.Error(w, "failed to update friend", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updated)
}

// DELETE /friends/:id
func (r *FriendRouter) Delete(w http.ResponseWriter, req *http.Request, id int) {
	user, err := middleware.GetAuthUser(req)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	friend, err := r.friendRepo.Get(id)
	if err != nil {
		http.Error(w, "friend not found", http.StatusNotFound)
		return
	}
	if friend.CreatedBy != user.ID {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	if err := r.friendRepo.Delete(id); err != nil {
		http.Error(w, "failed to delete friend", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
