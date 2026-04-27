COMPOSE_FILE=docker-compose.dev.yml
DC = docker compose -f $(COMPOSE_FILE)
EXEC_BACKEND = $(DC) exec backend
EXEC_FRONTEND = $(DC) exec frontend

.PHONY: help start stop restart logs logs-backend logs-frontend rails migrate seed \
       questions-and-answers bash frontend build rebuild clean reset-db ps \
       npm-install npm-add lint-frontend lint-backend lint

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

start: ## Start all containers
	$(DC) up -d

stop: ## Stop containers (SAFE — keeps DB)
	$(DC) down

restart: ## Restart containers (SAFE)
	$(DC) restart

logs: ## View logs (all services)
	$(DC) logs -f

logs-backend: ## View logs for Rails only
	$(DC) logs -f backend

logs-frontend: ## View logs for React only
	$(DC) logs -f frontend

rails: ## Open Rails console
	$(EXEC_BACKEND) rails console

migrate: ## Run Rails migrations
	$(EXEC_BACKEND) rails db:migrate

seed: ## Seed database
	$(EXEC_BACKEND) rails db:seed

questions-and-answers: ## Add Questions and Answers
	$(EXEC_BACKEND) bundle exec rails runner add_questions_and_answers_script.rb

bash: ## Open bash inside Rails container
	$(EXEC_BACKEND) bash

frontend: ## Open shell inside frontend container
	$(EXEC_FRONTEND) sh

build: ## Build containers (SAFE)
	$(DC) build

rebuild: ## Rebuild containers (SAFE — keeps DB)
	$(DC) build --no-cache
	$(DC) up -d

clean: ## Remove containers ONLY (SAFE — keeps DB)
	$(DC) down

reset-db: ## ⚠️ Dangerous — Deletes Database
	$(DC) down -v
	$(DC) up -d

ps: ## Show running containers
	$(DC) ps

npm-install: ## Install frontend packages inside container
	$(EXEC_FRONTEND) npm install

npm-add: ## Install specific npm package (usage: make npm-add pkg=name)
	$(EXEC_FRONTEND) npm install $(pkg)

lint-frontend: ## Run frontend lint inside container
	$(EXEC_FRONTEND) npm run lint

lint-backend: ## Run backend rubocop
	$(EXEC_BACKEND) bundle exec rubocop

lint: lint-frontend lint-backend ## Run both linters
