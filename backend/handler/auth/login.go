package auth

import (
	"net/http"
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var googleOauthConfig = &oauth2.Config{
	ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
	ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
	RedirectURL:  os.Getenv("FRONTEND_BASEURL") + "/callback", // Next.js 側のcallbackページ
	Scopes:       []string{"openid", "email", "profile"},
	Endpoint:     google.Endpoint,
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	// state は CSRF対策用のランダム文字列。本番はちゃんと生成してセッションに保存する
	state := "state-token"

	// Google認可ページのURLを生成
	url := googleOauthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)

	// Googleにリダイレクト
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}
