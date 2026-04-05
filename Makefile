COMPOSE_FILE=docker-compose.dev.yml

# Start containers
start:
	docker compose -f $(COMPOSE_FILE) up -d

# Stop containers
stop:
	docker compose -f $(COMPOSE_FILE) down

# Restart containers
restart:
	docker compose -f $(COMPOSE_FILE) down
	docker compose -f $(COMPOSE_FILE) up -d

# View logs (all services)
logs:
	docker compose -f $(COMPOSE_FILE) logs -f

# View logs for Rails only
logs-backend:
	docker compose -f $(COMPOSE_FILE) logs -f rails_backend

# View logs for React only
logs-frontend:
	docker compose -f $(COMPOSE_FILE) logs -f react_frontend

# Open Rails console
rails:
	docker compose -f $(COMPOSE_FILE) exec rails_backend rails console

# Run Rails migrations
migrate:
	docker compose -f $(COMPOSE_FILE) exec rails_backend rails db:migrate

# Seed database
seed:
	docker compose -f $(COMPOSE_FILE) exec rails_backend rails db:seed

# Open bash inside Rails container
bash:
	docker compose -f $(COMPOSE_FILE) exec rails_backend bash

# Rebuild containers
build:
	docker compose -f $(COMPOSE_FILE) build

# Rebuild without cache
rebuild:
	docker compose -f $(COMPOSE_FILE) build --no-cache

# Remove containers + volumes (reset DB)
clean:
	docker compose -f $(COMPOSE_FILE) down -v

# Show running containers
ps:
	docker compose -f $(COMPOSE_FILE) ps