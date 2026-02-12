# CLAUDE.md

## Project Overview

Yet Another Path Planner (YAPP) -- a tool for flight simulation enthusiasts to find, create, and track flight tours for virtual flying careers. Early-stage (v0.1.0) TypeScript monorepo.

## Tech Stack

- **Runtime:** Node.js 20+, pnpm 9.15.9+ (monorepo)
- **Frontend:** Next.js 15, React 19, Tailwind CSS, App Router (`frontend/`)
- **Backend:** NestJS 10, Express, Swagger/OpenAPI, OpenTelemetry (`backend/`)
- **API Gateway:** Express 4.x BFF layer (`api-gateway/`)
- **Orchestration:** Turborepo for task caching and parallel execution
- **Database:** PostgreSQL 16, Redis 7 (via Docker Compose for local dev)
- **Observability:** OpenTelemetry SDK with Grafana Cloud (LGTM stack)

## Monorepo Structure

```
frontend/        # @yapp/frontend - Next.js 15 app (port 3000)
backend/         # @yapp/backend  - NestJS API (port 3001)
api-gateway/     # @yapp/api-gateway - Express BFF (port 3002)
packages/        # Shared libraries (currently empty)
tools/           # Dev utilities (currently empty)
docs/            # Architecture and onboarding docs
infrastructure/  # Kubernetes manifests / IaC (placeholder)
ops/             # CI/CD configs, runbooks, dashboards
```

## Common Commands

```bash
pnpm install          # Install all dependencies
pnpm dev              # Run all services in dev mode
pnpm build            # Build all packages (via Turborepo)
pnpm test             # Run all tests (Jest for backend/api-gateway, Vitest for frontend)
pnpm lint             # Lint all packages (ESLint)
pnpm format           # Format all code (Prettier)
pnpm clean            # Remove build artifacts and node_modules
```

### Per-package commands

```bash
# Frontend
cd frontend && pnpm test        # Vitest unit tests
cd frontend && pnpm test:e2e    # Playwright E2E tests

# Backend
cd backend && pnpm test         # Jest unit tests
cd backend && pnpm test:cov     # Jest with coverage
cd backend && pnpm test:e2e     # Jest E2E tests

# Docker
docker compose up --build       # Full local stack (postgres, redis, frontend, backend)
```

## Code Style

- **Prettier:** No semicolons, single quotes, 2-space indent, 100-char line width, ES5 trailing commas, no parens on single-arg arrows
- **ESLint:** Next.js defaults for frontend; `@typescript-eslint` for backend and api-gateway
- **TypeScript:** Strict mode in frontend and api-gateway; looser in backend (NestJS decorator conventions)

## Testing

| Package      | Framework  | Config location                  | Test pattern       |
|------------- |----------- |--------------------------------- |------------------- |
| frontend     | Vitest     | `frontend/vitest.config.ts`      | `*.test.ts(x)`     |
| backend      | Jest       | `backend/package.json` (inline)  | `*.spec.ts`        |
| api-gateway  | Jest       | `api-gateway/package.json`       | `*.spec.ts`        |

## Architecture Notes

- Turborepo `test` task depends on `build`; always build before testing.
- Frontend uses App Router (`src/app/`), not Pages Router.
- Backend uses NestJS decorator-based modules/controllers/providers with constructor injection.
- OpenTelemetry instrumentation is expected on all services. Update Grafana/LGTM configs when adding or removing services.
- Docker images use multi-stage builds targeting `linux/amd64` and `linux/arm64`, published to GitHub Container Registry (GHCR).

## Key Documentation

- `docs/architecture.md` -- system design, deployment topology, tech choices
- `docs/onboarding.md` -- local setup, environment config, troubleshooting
- `.github/copilot-instructions.md` -- AI agent collaboration rules
- `.github/instructions/*.instructions.md` -- path-specific instructions for components
- `.github/copilot-setup-steps.yml` -- environment setup for Copilot coding agent
- `AGENTS.md` -- custom agent profiles documentation
- `.github/pull_request_template.md` -- PR checklist

## CI/CD

GitHub Actions workflows in `.github/workflows/`:
- **ci.yml** -- lint, test, build matrix on push/PR to main
- **docker-build.yml** -- multi-arch Docker image builds, push to GHCR
- **copilot-instructions-check.yml** -- validates copilot instructions file
