include .env

migrate-create:
	docker compose run --rm migrate create -ext sql -dir /migrations -seq $(name)

migrate-up:
	docker compose run --rm migrate -path=/migrations -database "$(DATABASE_URL)?sslmode=disable" up

migrate-reset:
	docker compose run --rm migrate -path=/migrations -database "$(DATABASE_URL)?sslmode=disable" drop -f
	docker compose run --rm migrate -path=/migrations -database "$(DATABASE_URL)?sslmode=disable" up

start:
	docker compose up -d

stop:
	docker compose stop

remove:
	docker compose down

setup:
	docker compose build
	cd backend && go mod tidy
	cd frontend && npm install