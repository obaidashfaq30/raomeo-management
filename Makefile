.PHONY: setup up down logs backend-shell frontend-shell test

setup:
	docker compose build
	docker compose run --rm backend ./bin/rails db:prepare

up:
	docker compose up

down:
	docker compose down

logs:
	docker compose logs -f

backend-shell:
	docker compose run --rm backend bash

frontend-shell:
	docker compose run --rm frontend sh

test:
	docker compose run --rm -e RAILS_ENV=test backend bundle exec rails db:prepare
	docker compose run --rm -e RAILS_ENV=test backend bundle exec rspec
	docker compose run --rm frontend npm run build
