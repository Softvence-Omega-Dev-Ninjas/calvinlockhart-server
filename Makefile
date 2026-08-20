# Docker Configuration
APP_IMAGE := softvence/calvinlockhart-server:latest
COMPOSE_FILE := compose.yaml

.PHONY: help build up down restart logs clean push dev-db

# Default target
help:
	@echo "========================================================"
	@echo "Calvin Lockhart Server - Docker Management Commands"
	@echo "========================================================"
	@echo "  make build       - Build production multi-stage Docker image"
	@echo "  make up          - Start all containers in detached mode"
	@echo "  make down        - Stop and remove all containers"
	@echo "  make restart     - Restart containers"
	@echo "  make logs        - Follow container application logs"
	@echo "  make dev-db      - Start only local Postgres database"
	@echo "  make clean       - Remove containers, volumes, and built images"
	@echo "  make push        - Build and push image to Docker Hub"

# Build production multi-stage Docker image
build:
	docker build -t $(APP_IMAGE) .

# Start containers
up:
	docker compose -f $(COMPOSE_FILE) up -d --build

# Stop containers
down:
	docker compose -f $(COMPOSE_FILE) down

# Restart containers
restart: down up

# Show logs
logs:
	docker compose -f $(COMPOSE_FILE) logs -f server

# Start only local dev PostgreSQL database
dev-db:
	docker compose -f $(COMPOSE_FILE) up -d db

# Clean up environment
clean: down
	docker volume rm calvinlockhart_db || true
	docker rmi $(APP_IMAGE) || true

# Push image to registry
push: build
	docker push $(APP_IMAGE)
