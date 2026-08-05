# Dexta Africa frontend task runner
# Run `make help` to list the supported workflows.

SHELL := /bin/sh
.DEFAULT_GOAL := help

APP_NAME ?= dexta-africa-web
APP_PORT ?= 3000
IMAGE_NAME ?= $(APP_NAME)
IMAGE_TAG ?= latest

NPM := npm
DOCKER := docker
DEV_COMPOSE := $(DOCKER) compose -f compose.dev.yaml
PROD_COMPOSE := $(DOCKER) compose -f compose.prod.yaml

export APP_PORT IMAGE_NAME IMAGE_TAG

.PHONY: help doctor install dev build start lint typecheck test test-watch format format-check check verify \
	dev-build dev-up dev-down dev-restart dev-logs dev-shell dev-status \
	prod-build prod-up prod prod-down prod-restart prod-logs prod-shell prod-status \
	config-dev config-prod health clean clean-all

help: ## Show available commands
	@awk 'BEGIN {FS = ":.*## "; printf "\nDexta Africa frontend\n\nUsage:\n  make <target> [APP_PORT=3000] [IMAGE_TAG=latest]\n\nTargets:\n"} /^[a-zA-Z0-9_-]+:.*## / {printf "  %-18s %s\n", $$1, $$2} END {printf "\nExamples:\n  make dev\n  make verify\n  make prod IMAGE_TAG=v1.0.0\n  make prod-logs\n\n"}' $(MAKEFILE_LIST)

doctor: ## Check that local development tools are installed
	@command -v $(NPM) >/dev/null 2>&1 || { echo "Error: npm is not installed." >&2; exit 1; }
	@command -v node >/dev/null 2>&1 || { echo "Error: Node.js is not installed." >&2; exit 1; }
	@node -e 'const major=Number(process.versions.node.split(".")[0]); if (major < 20) { console.error("Error: Node.js 20 or newer is required; found " + process.version); process.exit(1) }'
	@echo "Node $$(node --version) and npm $$(npm --version) are ready."

install: doctor ## Install exact dependencies from package-lock.json
	$(NPM) ci

dev: doctor ## Run the local Next.js development server
	$(NPM) run dev -- --hostname 0.0.0.0 --port $(APP_PORT)

build: doctor ## Create a local optimized production build
	$(NPM) run build

start: doctor ## Run a previously built local production bundle
	$(NPM) run start -- --hostname 0.0.0.0 --port $(APP_PORT)

lint: doctor ## Run ESLint with zero warnings allowed
	$(NPM) run lint

typecheck: doctor ## Validate TypeScript without emitting files
	$(NPM) run typecheck

test: doctor ## Run the automated test suite once
	$(NPM) run test

test-watch: doctor ## Run tests continuously while developing
	$(NPM) run test:watch

format: doctor ## Format supported project files
	$(NPM) run format

format-check: doctor ## Check formatting without changing files
	$(NPM) run format:check

check: doctor ## Run types, lint, tests, and formatting checks
	$(NPM) run check

verify: check build ## Run every pre-release quality gate

config-dev: ## Validate the development Compose configuration
	@command -v $(DOCKER) >/dev/null 2>&1 || { echo "Error: Docker is not installed." >&2; exit 1; }
	$(DEV_COMPOSE) config --quiet

config-prod: ## Validate the production Compose configuration
	@command -v $(DOCKER) >/dev/null 2>&1 || { echo "Error: Docker is not installed." >&2; exit 1; }
	$(PROD_COMPOSE) config --quiet

dev-build: config-dev ## Build the development container image
	$(DEV_COMPOSE) build

dev-up: config-dev ## Start Docker development with hot reload
	$(DEV_COMPOSE) up --build

dev-down: ## Stop Docker development containers
	$(DEV_COMPOSE) down --remove-orphans

dev-restart: dev-down dev-up ## Rebuild and restart Docker development

dev-logs: ## Follow development container logs
	$(DEV_COMPOSE) logs --follow --tail=200 web

dev-shell: ## Open a shell in the running development container
	$(DEV_COMPOSE) exec web sh

dev-status: ## Show development container and health status
	$(DEV_COMPOSE) ps

prod-build: config-prod ## Build the hardened production image
	$(PROD_COMPOSE) build --pull

prod-up: config-prod ## Start the existing production image in the background
	$(PROD_COMPOSE) up --detach --no-build --remove-orphans

prod: prod-build prod-up ## Build and start production in the background

prod-down: ## Stop production containers
	$(PROD_COMPOSE) down --remove-orphans

prod-restart: prod-down prod ## Rebuild and restart production

prod-logs: ## Follow production container logs
	$(PROD_COMPOSE) logs --follow --tail=200 web

prod-shell: ## Open a shell in the running production container
	$(PROD_COMPOSE) exec web sh

prod-status: ## Show production container and health status
	$(PROD_COMPOSE) ps

health: ## Check the running application's health endpoint
	@curl --fail --silent --show-error "http://localhost:$(APP_PORT)/api/health" && printf '\n'

clean: ## Remove generated local build and coverage output
	rm -rf -- .next coverage

clean-all: dev-down prod-down ## Remove containers and the development dependency volume
	$(DEV_COMPOSE) down --volumes --remove-orphans
