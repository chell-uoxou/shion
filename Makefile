include .env

migrate-create:
	docker compose run --rm migrate create -ext sql -dir /migrations -seq $(name)

migrate-up:
	docker compose run --rm migrate -path=/migrations -database "$(DATABASE_URL)?sslmode=disable" up

migrate-reset:
	docker compose run --rm migrate -path=/migrations -database "$(DATABASE_URL)?sslmode=disable" drop -f
	docker compose run --rm migrate -path=/migrations -database "$(DATABASE_URL)?sslmode=disable" up
