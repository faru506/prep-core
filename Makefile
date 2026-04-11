COMPOSE_FILE=docker-compose.dev.yml

# Start containers
start:
	docker compose -f $(COMPOSE_FILE) up -d

# Stop containers (SAFE — keeps DB)
stop:
	docker compose -f $(COMPOSE_FILE) down

# Restart containers (SAFE)
restart:
	docker compose -f $(COMPOSE_FILE) restart

# View logs (all services)
logs:
	docker compose -f $(COMPOSE_FILE) logs -f

# View logs for Rails only
logs-backend:
	docker compose -f $(COMPOSE_FILE) logs -f backend

# View logs for React only
logs-frontend:
	docker compose -f $(COMPOSE_FILE) logs -f frontend

# Open Rails console
rails:
	docker compose -f $(COMPOSE_FILE) exec backend rails console

# Run Rails migrations
migrate:
	docker compose -f $(COMPOSE_FILE) exec backend rails db:migrate

# Seed database
seed:
	docker compose -f $(COMPOSE_FILE) exec backend rails db:seed

# Open bash inside Rails container
bash:
	docker compose -f $(COMPOSE_FILE) exec backend bash

# Open bash inside frontend container
frontend:
	docker compose -f $(COMPOSE_FILE) exec frontend sh

# Build containers (SAFE)
build:
	docker compose -f $(COMPOSE_FILE) build

# Rebuild containers (SAFE — keeps DB)
rebuild:
	docker compose -f $(COMPOSE_FILE) build --no-cache
	docker compose -f $(COMPOSE_FILE) up -d

# Remove containers ONLY (SAFE — keeps DB)
clean:
	docker compose -f $(COMPOSE_FILE) down

# ⚠️ Dangerous — Deletes Database
reset-db:
	docker compose -f $(COMPOSE_FILE) down -v
	docker compose -f $(COMPOSE_FILE) up -d

# Show running containers
ps:
	docker compose -f $(COMPOSE_FILE) ps

# Install frontend packages inside container
npm-install:
	docker compose -f $(COMPOSE_FILE) exec frontend npm install

# Install specific npm package
npm-add:
	docker compose -f $(COMPOSE_FILE) exec frontend npm install $(pkg)