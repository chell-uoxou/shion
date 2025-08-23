package handler

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"shion/middleware"
	"shion/repository/postgres"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type AuthCallbackRouter struct {
	userRepo *postgres.UserRepository
}

func NewAuthCallbackRouter(userRepo *postgres.UserRepository) *AuthCallbackRouter {
	return &AuthCallbackRouter{userRepo: userRepo}
}

func extractProfileFromIDToken(idToken string) (string, string, string, string, error) {
	parser := jwt.NewParser()
	claims := jwt.MapClaims{}
	_, _, err := parser.ParseUnverified(idToken, claims)
	if err != nil {
		return "", "", "", "", err
	}

	email, _ := claims["email"].(string)
	name, _ := claims["name"].(string)
	sub, _ := claims["sub"].(string)
	avatar_url, _ := claims["picture"].(string)
	return email, name, sub, avatar_url, nil
}

func (router *AuthCallbackRouter) AuthCallbackHandler(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Code string `json:"code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	token, err := googleOauthConfig.Exchange(context.Background(), body.Code)
	if err != nil {
		http.Error(w, "token exchange failed", http.StatusInternalServerError)
		return
	}

	rawIDToken, ok := token.Extra("id_token").(string)
	if !ok {
		http.Error(w, "no id_token", http.StatusInternalServerError)
		return
	}

	email, name, sub, avatar_url, err := extractProfileFromIDToken(rawIDToken) // JWT decodeしてGoogleのプロフィール情報を取得
	if err != nil {
		http.Error(w, "invalid id_token", http.StatusInternalServerError)
		return
	}

	// ユーザーの存在を確認
	user, err := router.userRepo.GetUserByGoogleSub(sub)
	if user == nil || err == sql.ErrNoRows {
		// ユーザーが存在しない場合は新規作成
		user, err = router.userRepo.CreateUser(name, sql.NullString{String: avatar_url, Valid: true}, sql.NullString{String: sub, Valid: true})
		if err != nil {
			http.Error(w, "failed to create user", http.StatusInternalServerError)
			return
		}
	}

	fmt.Printf("info: User %s logged in\n", user.Name)

	// 自前のJWTを発行
	claims := &middleware.AuthClaims{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   sub,
			ExpiresAt: jwt.NewNumericDate(token.Expiry),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	myToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, _ := myToken.SignedString([]byte(os.Getenv("JWT_SECRET")))

	fmt.Println("info: jwt created: " + signed)

	// HttpOnly Cookie に保存
	http.SetCookie(w, &http.Cookie{
		Name:     "app_token",
		Value:    signed,
		HttpOnly: true,
		Secure:   false, // 本番はtrue + HTTPS必須
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
	})

	w.Write([]byte("login success"))
}
