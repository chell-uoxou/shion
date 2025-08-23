package postgres

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() error {
	dsn := os.Getenv("DATABASE_URL")

	if dsn == "" {
		fmt.Println("error: DATABASE_URL is not set")
		return fmt.Errorf("DATABASE_URL is not set")
	}
	fmt.Println("info: DATABASE_URL is set to", dsn)
	db, err := sql.Open("postgres", dsn)

	if err != nil {
		fmt.Println("error: Database connection failed:", err)
		return err
	} else {
		fmt.Println("info: Database connection established.")
	}
	DB = db
	return nil
}
