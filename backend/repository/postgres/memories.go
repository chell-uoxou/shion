package postgres

import (
	"database/sql"
	"time"
)

// Memory は memories テーブルの1行に対応
type Memory struct {
	ID        int        `json:"id"`
	CreatedBy int        `json:"created_by"`
	Title     string     `json:"title"`
	Note      *string    `json:"note"`
	Location  *string    `json:"location"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`
}

// MemoryRepository は memories テーブルを操作する
type MemoryRepository struct {
	db *sql.DB
}

func NewMemoryRepository(db *sql.DB) *MemoryRepository {
	return &MemoryRepository{db: db}
}

// List 全ての memories を返す（論理削除は除外）
func (r *MemoryRepository) List(userID int) ([]Memory, error) {
	rows, err := r.db.Query(`
		SELECT id, created_by, title, note, location, created_at, updated_at, deleted_at
		FROM memories
		WHERE created_by = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	memories := []Memory{} // ← nil ではなく空スライスで初期化
	for rows.Next() {
		var m Memory
		if err := rows.Scan(&m.ID, &m.CreatedBy, &m.Title, &m.Note, &m.Location, &m.CreatedAt, &m.UpdatedAt, &m.DeletedAt); err != nil {
			return nil, err
		}
		memories = append(memories, m)
	}
	return memories, nil
}

// Get 特定の memory を取得
func (r *MemoryRepository) Get(id int) (*Memory, error) {
	row := r.db.QueryRow(`
		SELECT id, created_by, title, note, location, created_at, updated_at, deleted_at
		FROM memories
		WHERE id = $1 AND deleted_at IS NULL
	`, id)

	var m Memory
	if err := row.Scan(&m.ID, &m.CreatedBy, &m.Title, &m.Note, &m.Location, &m.CreatedAt, &m.UpdatedAt, &m.DeletedAt); err != nil {
		return nil, err
	}
	return &m, nil
}

// Create 新しい memory を挿入
func (r *MemoryRepository) Create(createdBy int, title, note, location string) (*Memory, error) {
	var m Memory
	err := r.db.QueryRow(`
		INSERT INTO memories (created_by, title, note, location)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_by, title, note, location, created_at, updated_at, deleted_at
	`, createdBy, title, note, location).Scan(
		&m.ID, &m.CreatedBy, &m.Title, &m.Note, &m.Location, &m.CreatedAt, &m.UpdatedAt, &m.DeletedAt,
	)
	if err != nil {
		return nil, err
	}
	return &m, nil
}

// Update 既存の memory を更新
func (r *MemoryRepository) Update(id int, title, note, location string) (*Memory, error) {
	var m Memory
	err := r.db.QueryRow(`
		UPDATE memories
		SET title=$2, note=$3, location=$4, updated_at=NOW()
		WHERE id=$1 AND deleted_at IS NULL
		RETURNING id, created_by, title, note, location, created_at, updated_at, deleted_at
	`, id, title, note, location).Scan(
		&m.ID, &m.CreatedBy, &m.Title, &m.Note, &m.Location, &m.CreatedAt, &m.UpdatedAt, &m.DeletedAt,
	)
	if err != nil {
		return nil, err
	}
	return &m, nil
}

// Delete 論理削除
func (r *MemoryRepository) Delete(id int) error {
	_, err := r.db.Exec(`
		UPDATE memories
		SET deleted_at=NOW()
		WHERE id=$1 AND deleted_at IS NULL
	`, id)
	return err
}
