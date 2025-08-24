include .env

migrate-create:
	docker compose run --rm migrate create -ext sql -dir /migrations -seq $(name)

migrate-up:
	docker compose run --rm migrate -path=/migrations -database "$(DATABASE_URL)" up

migrate-reset:
	docker compose run --rm migrate -path=/migrations -database "$(DATABASE_URL)" drop -f
	docker compose run --rm migrate -path=/migrations -database "$(DATABASE_URL)" up

start:
	docker compose up -d

stop:
	docker compose stop

remove:
	docker compose down

setup:
	docker compose build
	make checkout
	make stop

checkout:
	make start
	cd frontend && npm install
	cd frontend && npm run orval
	make migrate-up
