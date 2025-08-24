package resource

import (
	"encoding/json"
	"net/http"
	"shion/middleware"
	"shion/repository/postgres"
)

type RecentMemoryRouter struct {
	memoryRepo *postgres.MemoryRepository
	userRepo   *postgres.UserRepository
	friendRepo *postgres.FriendRepository
}

func NewRecentMemoryRouter(repoMemory *postgres.MemoryRepository, repoUser *postgres.UserRepository, repoFriend *postgres.FriendRepository) *RecentMemoryRouter {
	return &RecentMemoryRouter{
		memoryRepo: repoMemory,
		userRepo:   repoUser,
		friendRepo: repoFriend,
	}
}

func (r *RecentMemoryRouter) Register(mux *http.ServeMux) {
	// /recent_friends 一覧取得（認証必須）
	mux.Handle("/recent_friends", middleware.RequireAuth(r.userRepo, http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		if req.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		r.ListRecent(w, req)
	})))
}

// --- Handlers ---

// GET /recent_friends
func (r *RecentMemoryRouter) ListRecent(w http.ResponseWriter, req *http.Request) {
	user, err := middleware.GetAuthUser(req)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	// last_selected_at 順に friends を取得
	friends, err := r.friendRepo.ListOrderedByLastSelected(user.ID)
	if err != nil {
		http.Error(w, "failed to fetch friends", http.StatusInternalServerError)
		return
	}

	// friend ごとに最後の memory を取得
	type Response struct {
		Friend       postgres.Friend  `json:"friend"`
		RecentMemory *postgres.Memory `json:"recent_memory"`
	}
	result := []Response{}

	for _, f := range friends {
		memory, err := r.memoryRepo.GetLatestByFriend(f.ID)
		if err != nil {
			// 見つからなければ recent_memory は null
			result = append(result, Response{Friend: f, RecentMemory: nil})
			continue
		}
		result = append(result, Response{Friend: f, RecentMemory: memory})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}
