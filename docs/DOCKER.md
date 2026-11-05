# Docker deployment and container development

The production image uses Next.js standalone output and runs as the unprivileged `nextjs` user (`uid: 1001`).
Only traced server files, optimized static assets, and `public/` media enter the runtime stage.

## Container development workflows

### 1. VS Code / Cursor dev containers (recommended)

This repository includes `.devcontainer/devcontainer.json`.

1. Open this repository in VS Code or Cursor with the "Dev Containers" extension installed.
2. Click **Reopen in Container** when prompted (or via the Command Palette: `Dev Containers: Reopen in Container`).
3. The environment mounts your code at `/app`, attaches hot-reload ports (`3000`), preconfigures ESLint, Prettier, Tailwind CSS, and runs as the non-root `node` user.

### 2. Docker Compose CLI development

Run the development container with hot-reload and isolated dependency volumes:

```bash
# Start development container
make dev-up
# or: docker compose -f compose.dev.yaml up --build

# Follow development logs
make dev-logs

# Open an interactive shell inside the development container
make dev-shell

# Run quality checks inside the container
make dev-check
make dev-test

# Stop containers
make dev-down
```

The development container compares the mounted `package-lock.json` with the
dependency volume on every start. When dependencies change, it runs `npm ci`
inside the volume before starting Next.js. File polling is enabled by default
so edits made through Docker Desktop, WSL, or other bind mounts trigger Fast
Refresh reliably.

The entrypoint also verifies that Next.js's platform-specific Linux SWC and
Tailwind Oxide binaries are present and repairs stale volumes when necessary.

## Production container build and run

Run the hardened standalone runner:

```bash
# Build and run production
make prod

# Inspect running status and healthcheck
make prod-status

# Stop production containers
make prod-down
```

The application is available at `http://localhost:3001` (or custom `$APP_PORT`). Override the host port when needed:

```bash
APP_PORT=8080 make prod-up
```

## Health check

Both the image and Compose service check `/api/health`. Inspect the result directly:

```bash
curl --fail http://localhost:3001/api/health
make health
```

## Environment variables

Set runtime values through the deployment platform or an uncommitted `.env` file:

```env
NEXT_PUBLIC_APP_URL=https://example.com
BACKEND_API_URL=http://localhost:8080
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
APP_PORT=3000
CONTACT_WEBHOOK_URL=https://crm.example.com/hooks/contact
NEWSLETTER_WEBHOOK_URL=https://crm.example.com/hooks/newsletter
```

`NEXT_PUBLIC_*` variables are supplied as build arguments (`ARG`) and runtime environments (`ENV`)
so that Next.js client bundles embed the correct public endpoints during standalone compilation.

## Security and performance properties

- **Non-root runtime**: UID/GID `1001` (`nextjs`) in production, `1000` (`node`) in dev.
- **Read-only root filesystem**: `read_only: true` with strict memory-capped tmpfs mounts for `/tmp` and `/app/.next/cache`.
- **Capability dropping**: `cap_drop: ALL` with `no-new-privileges: true`.
- **Logging protection**: Production json-file logs capped at 10MB x 3 rotations to avoid host disk exhaustion.
- **Supply chain attestation**: Multi-platform (linux/amd64, linux/arm64) builds with SLSA provenance and SBOM attestation.
- **BuildKit caching**: Next.js and npm cache mounts for up to 5x faster container compilation.
