package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func extractEmailFromIDToken(idToken string) (string, error) {
	parser := jwt.NewParser()
	claims := jwt.MapClaims{}
	_, _, err := parser.ParseUnverified(idToken, claims)
	if err != nil {
		return "", err
	}

	// email フィールドを取り出す
	email, _ := claims["email"].(string)
	return email, nil
}

func AuthCallbackHandler(w http.ResponseWriter, r *http.Request) {
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

	email, err := extractEmailFromIDToken(rawIDToken) // JWT decodeしてsub/email取得
	if err != nil {
		http.Error(w, "invalid id_token", http.StatusInternalServerError)
		return
	}

	// 自前のJWTを発行
	claims := jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(time.Hour).Unix(),
	}
	myToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, _ := myToken.SignedString([]byte(os.Getenv("JWT_SECRET")))

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
