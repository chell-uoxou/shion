package auth

import (
	"net/http"
	"time"
)

// LogoutHandler はログアウト処理を行う
func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	// Cookie を即時無効化
	http.SetCookie(w, &http.Cookie{
		Name:     "app_token", // middleware / cookieAuth と一致させる
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true, // 本番は true を推奨（https）
		SameSite: http.SameSiteLaxMode,
	})
}
