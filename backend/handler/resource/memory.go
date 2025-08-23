package resource

import (
	"encoding/json"
	"net/http"
	"shion/middleware"
	"shion/repository/postgres"
	"strconv"
	"time"
)

type MemoryRouter struct {
	memoryRepo *postgres.MemoryRepository
	userRepo   *postgres.UserRepository
}

func NewMemoryRouter(repoMemory *postgres.MemoryRepository, repoUser *postgres.UserRepository) *MemoryRouter {
	return &MemoryRouter{memoryRepo: repoMemory, userRepo: repoUser}
}

func (r *MemoryRouter) Register(mux *http.ServeMux) {
	// /memories 一覧と新規作成（認証必須）
	mux.Handle("/memories", middleware.RequireAuth(r.userRepo, http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		switch req.Method {
		case http.MethodGet:
			r.List(w, req)
		case http.MethodPost:
			r.Create(w, req)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})))

	// /memories/:id 個別取得・更新・削除（認証必須）
	mux.Handle("/memories/", middleware.RequireAuth(r.userRepo, http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		idStr := req.URL.Path[len("/memories/"):]
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

// GET /memories
func (r *MemoryRouter) List(w http.ResponseWriter, req *http.Request) {
	user, err := middleware.GetAuthUser(req)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	memories, err := r.memoryRepo.List(user.ID)
	if err != nil {
		http.Error(w, "failed to fetch memories", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(memories)
}

// POST /memories
func (r *MemoryRouter) Create(w http.ResponseWriter, req *http.Request) {
	user, err := middleware.GetAuthUser(req)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	// リクエストボディ構造
	var body struct {
		Title      string                 `json:"title"`
		Note       string                 `json:"note"`
		Location   string                 `json:"location"`
		OccurredAt time.Time              `json:"occurred_at"`
		Friends    []postgres.FriendInput `json:"friends"`
	}
	if err := json.NewDecoder(req.Body).Decode(&body); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	// Memory + Friends をまとめて作成
	memory, err := r.memoryRepo.CreateWithFriends(
		user.ID,
		body.Title,
		body.Note,
		body.Location,
		body.OccurredAt,
		body.Friends,
	)
	if err != nil {
		http.Error(w, "failed to create memory", http.StatusInternalServerError)
		return
	}

	// JSON レスポンス
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(memory)
}

// GET /memories/:id
func (r *MemoryRouter) Get(w http.ResponseWriter, req *http.Request, id int) {
	user, err := middleware.GetAuthUser(req)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	memory, err := r.memoryRepo.Get(id)
	if err != nil {
		http.Error(w, "memory not found", http.StatusNotFound)
		return
	}

	if memory.CreatedBy != user.ID {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(memory)
}

// PUT /memories/:id
func (r *MemoryRouter) Update(w http.ResponseWriter, req *http.Request, id int) {
	user, err := middleware.GetAuthUser(req)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var body struct {
		Title      string    `json:"title"`
		Note       string    `json:"note"`
		Location   string    `json:"location"`
		OccurredAt time.Time `json:"occurred_at"`
	}
	if err := json.NewDecoder(req.Body).Decode(&body); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	memory, err := r.memoryRepo.Get(id)
	if err != nil {
		http.Error(w, "memory not found", http.StatusNotFound)
		return
	}
	if memory.CreatedBy != user.ID {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	updated, err := r.memoryRepo.Update(id, body.Title, body.Note, body.Location, body.OccurredAt)
	if err != nil {
		http.Error(w, "failed to update memory", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updated)
}

// DELETE /memories/:id
func (r *MemoryRouter) Delete(w http.ResponseWriter, req *http.Request, id int) {
	user, err := middleware.GetAuthUser(req)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	memory, err := r.memoryRepo.Get(id)
	if err != nil {
		http.Error(w, "memory not found", http.StatusNotFound)
		return
	}
	if memory.CreatedBy != user.ID {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	if err := r.memoryRepo.Delete(id); err != nil {
		http.Error(w, "failed to delete memory", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
