package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

const SERVER_PORT = ":8080"

func main() {
	fmt.Println("Launching shion backend...")

	r := gin.Default()
	r.GET("/health", func(c *gin.Context) {
		fmt.Println("health 叩かれた！")
		c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "うごいてるよ"})
	})

	fmt.Printf("Listening on %s\n", SERVER_PORT)
	r.Run(SERVER_PORT)
}
