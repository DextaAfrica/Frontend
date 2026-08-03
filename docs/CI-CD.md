# CI/CD pipeline

## Continuous integration

`.github/workflows/ci.yml` runs on pull requests and pushes to `main` and `develop`:

1. installs exactly from `package-lock.json`;
2. validates TypeScript, ESLint, and formatting;
3. creates and verifies the Next.js standalone production build;
4. validates development and production Compose manifests;
5. builds the production container with reusable GitHub Actions cache.

Branch protection should require all three CI jobs and CodeQL before merge.

## Security

`.github/workflows/codeql.yml` performs extended JavaScript/TypeScript analysis on pull requests,
main-branch changes, and a weekly schedule. The release workflow scans the immutable published image
for high and critical vulnerabilities and uploads SARIF results to GitHub code scanning.

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
