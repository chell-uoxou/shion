package postgres

import (
	"database/sql"
	"fmt"
	"time"
)

type UserRepository struct {
	db *sql.DB
}

type User struct {
	ID        int
	Name      string
	AvatarUrl sql.NullString
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt sql.NullTime
	GoogleSub sql.NullString
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) GetUserByGoogleSub(sub string) (*User, error) {
	var user User
	err := r.db.QueryRow(`
		SELECT id, name, avatar_url, created_at, updated_at, deleted_at, google_sub
		FROM users 
		WHERE google_sub = $1`, sub).
		Scan(&user.ID, &user.Name, &user.AvatarUrl, &user.CreatedAt, &user.UpdatedAt, &user.DeletedAt, &user.GoogleSub)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetUserByID(id int) (*User, error) {
	var user User
	err := r.db.QueryRow(`
		SELECT id, name, avatar_url, created_at, updated_at, deleted_at 
		FROM users 
		WHERE id = $1`, id).Scan(&user.ID, &user.Name, &user.AvatarUrl, &user.CreatedAt, &user.UpdatedAt, &user.DeletedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetAllUsers() ([]*User, error) {
	var users []*User
	rows, err := r.db.Query(`
		SELECT id, name, avatar_url, created_at, updated_at, deleted_at 
		FROM users`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var user User
		if err := rows.Scan(&user.ID, &user.Name, &user.AvatarUrl, &user.CreatedAt, &user.UpdatedAt, &user.DeletedAt); err != nil {
			return nil, err
		}
		users = append(users, &user)
	}
	return users, nil
}

func (r *UserRepository) CreateUser(name string, avatarUrl sql.NullString, googleSub sql.NullString) (*User, error) {
	var user User
	err := r.db.QueryRow(`
		INSERT INTO users (name, avatar_url, google_sub) 
		VALUES ($1, $2, $3) 
		RETURNING id, name, avatar_url, created_at, updated_at, deleted_at, google_sub`,
		name, avatarUrl, googleSub).Scan(&user.ID, &user.Name, &user.AvatarUrl, &user.CreatedAt, &user.UpdatedAt, &user.DeletedAt, &user.GoogleSub)

	fmt.Printf("user created: %d\n", user.ID)

	if err != nil {
		return nil, err
	}
	return &user, nil
}
