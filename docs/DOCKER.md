# Docker deployment

The production image uses Next.js standalone output and runs as the unprivileged `nextjs` user.
Only traced server files, optimized static assets, and `public/` media enter the runtime stage.

## Build and run

Ensure Docker Desktop or another compatible Docker daemon is running, then:

Development with hot reload and isolated dependency/cache volumes:

```bash
docker compose -f compose.dev.yaml up --build
```

The development container compares the mounted `package-lock.json` with the
dependency volume on every start. When dependencies change, it runs `npm ci`
inside the volume before starting Next.js. File polling is enabled by default
so edits made through Docker Desktop, WSL, or other bind mounts trigger Fast
Refresh reliably.

The entrypoint also verifies that Next.js's platform-specific Linux SWC binary
is present and repairs stale volumes when necessary. Dependencies and the build
cache are owned by the unprivileged runtime user, allowing Next.js to create a
fallback compiler directory without granting the application root privileges.

Development output under `.next` uses an ephemeral in-memory filesystem. It is
recreated with the container, preventing stale Turbopack manifests and browser
chunk URLs from surviving a development-server restart. The dependency volume
remains persistent, so this does not force packages to reinstall on each run.

Production with the hardened standalone runner:

```bash
docker compose -f compose.prod.yaml build
docker compose -f compose.prod.yaml up -d
docker compose -f compose.prod.yaml ps
```

The application is available at `http://localhost:3000`. Override the host port when needed:

```bash
APP_PORT=8080 docker compose -f compose.prod.yaml up -d
```

## Health

Both the image and Compose service check `/api/health`. Inspect the result directly:

```bash
curl --fail http://localhost:3000/api/health
docker inspect --format='{{json .State.Health}}' dexta-africa-web-1
```

## Production environment

Set production values through the deployment platform or an uncommitted `.env` file:

```env
NEXT_PUBLIC_APP_URL=https://example.com
APP_PORT=3000
CONTACT_WEBHOOK_URL=https://crm.example.com/hooks/contact
NEWSLETTER_WEBHOOK_URL=https://crm.example.com/hooks/newsletter
```

Do not bake secrets into the image. Content, contact, and newsletter credentials
are forwarded by Compose from the runtime environment and remain server-only.
`NEXT_PUBLIC_APP_URL` is intentionally supplied both as a production build
argument and at runtime because Next.js embeds public metadata during compilation.

## Security properties

- non-root UID/GID `1001`
- all Linux capabilities dropped by Compose
- `no-new-privileges` enabled
- signal forwarding through Compose `init`
- application telemetry disabled
- health-based runtime monitoring
- no source tree or development dependencies in the runner stage
