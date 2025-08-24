package postgres

import (
	"database/sql"
	"time"
)

// Friend は friends テーブルの1行に対応
type Friend struct {
	ID           int        `json:"id"`
	CreatedBy    int        `json:"created_by"`
	DisplayName  string     `json:"display_name"`
	Note         *string    `json:"note"`
	AvatarColor  *string    `json:"avatar_color"`
	AvatarIcon   *string    `json:"avatar_icon"`
	LastSelected *time.Time `json:"last_selected_at"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	DeletedAt    *time.Time `json:"deleted_at"`
}

// FriendRepository は friends テーブルを操作する
type FriendRepository struct {
	db *sql.DB
}

func NewFriendRepository(db *sql.DB) *FriendRepository {
	return &FriendRepository{db: db}
}

// List ユーザーが作成した全ての friends を返す（論理削除は除外）
func (r *FriendRepository) List(userID int) ([]Friend, error) {
	rows, err := r.db.Query(`
		SELECT id, created_by, display_name, note, avatar_color, avatar_icon, last_selected_at, created_at, updated_at, deleted_at
		FROM friends
		WHERE created_by = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	friends := []Friend{}
	for rows.Next() {
		var f Friend
		if err := rows.Scan(
			&f.ID, &f.CreatedBy, &f.DisplayName, &f.Note, &f.AvatarColor, &f.AvatarIcon,
			&f.LastSelected, &f.CreatedAt, &f.UpdatedAt, &f.DeletedAt,
		); err != nil {
			return nil, err
		}
		friends = append(friends, f)
	}
	return friends, nil
}

// Get 特定の friend を取得
func (r *FriendRepository) Get(id int) (*Friend, error) {
	row := r.db.QueryRow(`
		SELECT id, created_by, display_name, note, avatar_color, avatar_icon, last_selected_at, created_at, updated_at, deleted_at
		FROM friends
		WHERE id = $1 AND deleted_at IS NULL
	`, id)

	var f Friend
	if err := row.Scan(
		&f.ID, &f.CreatedBy, &f.DisplayName, &f.Note, &f.AvatarColor, &f.AvatarIcon,
		&f.LastSelected, &f.CreatedAt, &f.UpdatedAt, &f.DeletedAt,
	); err != nil {
		return nil, err
	}
	return &f, nil
}

// Create 新しい friend を挿入
func (r *FriendRepository) Create(createdBy int, displayName, note, avatarColor, avatarIcon string, lastSelected time.Time) (*Friend, error) {
	var f Friend
	err := r.db.QueryRow(`
		INSERT INTO friends (created_by, display_name, note, avatar_color, avatar_icon, last_selected_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_by, display_name, note, avatar_color, avatar_icon, last_selected_at, created_at, updated_at, deleted_at
	`, createdBy, displayName, note, avatarColor, avatarIcon, lastSelected).Scan(
		&f.ID, &f.CreatedBy, &f.DisplayName, &f.Note, &f.AvatarColor, &f.AvatarIcon,
		&f.LastSelected, &f.CreatedAt, &f.UpdatedAt, &f.DeletedAt,
	)
	if err != nil {
		return nil, err
	}
	return &f, nil
}

// Update 既存の friend を更新
func (r *FriendRepository) Update(id int, displayName, note, avatarColor, avatarIcon string, lastSelected time.Time) (*Friend, error) {
	var f Friend
	err := r.db.QueryRow(`
		UPDATE friends
		SET display_name=$2, note=$3, avatar_color=$4, avatar_icon=$5, last_selected_at=$6, updated_at=NOW()
		WHERE id=$1 AND deleted_at IS NULL
		RETURNING id, created_by, display_name, note, avatar_color, avatar_icon, last_selected_at, created_at, updated_at, deleted_at
	`, id, displayName, note, avatarColor, avatarIcon, lastSelected).Scan(
		&f.ID, &f.CreatedBy, &f.DisplayName, &f.Note, &f.AvatarColor, &f.AvatarIcon,
		&f.LastSelected, &f.CreatedAt, &f.UpdatedAt, &f.DeletedAt,
	)
	if err != nil {
		return nil, err
	}
	return &f, nil
}

// 特定のidのfriendの最終選択時を今に更新
func (r *FriendRepository) UpdateLastSelected(id int) error {
	_, err := r.db.Exec(`
		UPDATE friends
		SET last_selected_at=NOW()
		WHERE id=$1 AND deleted_at IS NULL
	`, id)
	return err
}

// Delete 論理削除
func (r *FriendRepository) Delete(id int) error {
	_, err := r.db.Exec(`
		UPDATE friends
		SET deleted_at=NOW()
		WHERE id=$1 AND deleted_at IS NULL
	`, id)
	return err
}
