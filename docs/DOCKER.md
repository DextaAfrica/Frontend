# Docker deployment

The production image uses Next.js standalone output and runs as the unprivileged `nextjs` user.
Only traced server files, optimized static assets, and `public/` media enter the runtime stage.

## Build and run

Ensure Docker Desktop or another compatible Docker daemon is running, then:

Development with hot reload and isolated dependency/cache volumes:

```bash
docker compose -f compose.dev.yaml up --build
```

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
```

Do not bake secrets into the image. Server-only CRM credentials for the newsletter integration should
be injected at runtime and consumed only by `src/app/api/newsletter/route.ts`.

## Security properties

- non-root UID/GID `1001`
- all Linux capabilities dropped by Compose
- `no-new-privileges` enabled
- signal forwarding through Compose `init`
- application telemetry disabled
- health-based runtime monitoring
- no source tree or development dependencies in the runner stage
