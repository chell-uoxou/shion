package auth

import (
	"net/http"
	"shion/middleware"
	"shion/repository/postgres"
)

type Router struct {
	userRepo *postgres.UserRepository
}

func NewRouter(userRepo *postgres.UserRepository) *Router {
	return &Router{userRepo: userRepo}
}

// Register は認証系エンドポイントを mux に登録する
func (r *Router) Register(mux *http.ServeMux) {
	//repo不要
	mux.HandleFunc("/login", LoginHandler)
	mux.HandleFunc("/logout", LogoutHandler)

	// /callback は repo必要
	callbackRouter := NewAuthCallbackRouter(r.userRepo)
	mux.HandleFunc("/callback", callbackRouter.AuthCallbackHandler)

	// /me は認証必須
	meRouter := NewMeRouter(r.userRepo)
	mux.Handle("/me", middleware.RequireAuth(r.userRepo, http.HandlerFunc(meRouter.MeHandler)))

}
