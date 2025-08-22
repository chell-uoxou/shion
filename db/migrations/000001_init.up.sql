-- users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- friends
CREATE TABLE friends (
  id SERIAL PRIMARY KEY,
  created_by INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  note TEXT,
  avatar_color TEXT,
  avatar_icon TEXT,
  last_selected_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- memories
CREATE TABLE memories (
  id SERIAL PRIMARY KEY,
  created_by INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  note TEXT,
  location TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- memory_photos
CREATE TABLE memory_photos (
  id SERIAL PRIMARY KEY,
  memory_id INT NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- memory_friends
CREATE TABLE memory_friends (
  id SERIAL PRIMARY KEY,
  memory_id INT NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  friend_id INT NOT NULL REFERENCES friends(id) ON DELETE CASCADE,
  reason_note TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- インデックス例（よく検索しそうなもの）
CREATE INDEX idx_friends_created_by ON friends(created_by);
CREATE INDEX idx_memories_created_by ON memories(created_by);
CREATE INDEX idx_memory_photos_memory_id ON memory_photos(memory_id);
CREATE INDEX idx_memory_friends_memory_id ON memory_friends(memory_id);
CREATE INDEX idx_memory_friends_friend_id ON memory_friends(friend_id);
