# CI/CD pipeline

## Local git hooks

The repository ships pre-commit and pre-push hooks in `.githooks/` so a broken
change is caught before it leaves a developer machine. They mirror CI exactly:

- **pre-commit** — `prettier --check` and `eslint` (fast).
- **pre-push** — `typecheck`, `test`, and the full `next build` (every route is
  rendered, so a page that throws fails the push).

They are enabled automatically by the `prepare` script on `npm install` /
`npm ci`, or manually with `make hooks` (`git config core.hooksPath .githooks`).
Bypass once, in an emergency only, with `SKIP_HOOKS=1 git commit` /
`SKIP_HOOKS=1 git push`. Keep the hook scripts and `.github/workflows/ci.yml` in
sync when either changes.

## Continuous integration

`.github/workflows/ci.yml` runs on pull requests and pushes to `main` and `develop`:

1. installs exactly from `package-lock.json`;
2. validates TypeScript, ESLint, unit tests, and formatting;
3. creates and verifies the Next.js standalone production build;
4. validates development and production Compose manifests;
5. builds the production container with reusable GitHub Actions cache.

Branch protection should require all three CI jobs before merge.

## Security

The release workflow scans the immutable published image for high and critical vulnerabilities with
Trivy and fails the release when actionable findings are detected. Results remain in the workflow log
because this repository does not have the GitHub Code Security product required for SARIF uploads.

Dependabot updates npm, Docker, and GitHub Actions dependencies weekly.

## Release and deployment

`.github/workflows/release.yml` runs for `main`, semantic version tags, and manual dispatches:

1. repeats quality and production-build verification;
2. builds AMD64 and ARM64 images;
3. publishes commit, version, and `latest` tags to GHCR;
4. attaches OCI labels and signed SLSA provenance;
5. scans the exact image digest;
6. enters the protected `production` GitHub environment;
7. deploys the immutable digest through the configured webhook;
8. verifies the production health endpoint.

Configure these repository settings:

- Repository variable: `DEPLOYMENT_ENVIRONMENT` (optional; defaults to `production`).
- Environment matching that name, with required reviewers for a manual approval gate.
- Environment variable: `PRODUCTION_URL` (for example `https://example.com`).
- Environment secret: `PRODUCTION_DEPLOY_WEBHOOK` from the chosen hosting platform.
- Package visibility and retention rules for `ghcr.io/<owner>/<repository>`.

The deploy webhook deliberately receives an image digest rather than a mutable tag.
