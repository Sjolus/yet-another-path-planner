# Codebase Review: Issues & Improvement Backlog

Findings from a comprehensive review of the YAPP codebase (v0.1.0). Issues are
ordered by severity/impact. Each section is formatted for easy conversion into
GitHub issues.

---

## 1. Backend TypeScript strict mode is disabled

**Labels:** `bug`, `backend`, `code-quality`

`backend/tsconfig.json` explicitly disables critical safety checks:

```json
"strictNullChecks": false,
"noImplicitAny": false,
"strictBindCallApply": false,
"forceConsistentCasingInFileNames": false,
"noFallthroughCasesInSwitch": false
```

This contradicts `CLAUDE.md` which acknowledges "looser" settings but still
expects NestJS decorator conventions -- not a wholesale opt-out from type safety.
`strictNullChecks: false` alone is responsible for the most common category of
runtime errors in TypeScript projects. The frontend and api-gateway both use
`strict: true`.

**Recommendation:** Enable `strict: true` in the backend `tsconfig.json` and fix
any resulting type errors. At minimum enable `strictNullChecks` and
`noImplicitAny`.

---

## 2. No tests exist anywhere in the codebase

**Labels:** `testing`, `high-priority`

All three packages use `--passWithNoTests` in their test scripts:

- `frontend/package.json`: `"test": "vitest run --passWithNoTests"`
- `backend/package.json`: `"test": "jest --passWithNoTests"`
- `api-gateway/package.json`: `"test": "jest --passWithNoTests"`

There are zero test files in the entire repository. The CI pipeline's "test" job
is effectively a no-op. The backend has `@nestjs/testing` and `supertest` as dev
dependencies but no spec files. The frontend has `@testing-library/react` and
`jsdom` but no test files.

**Recommendation:** Add at least basic test coverage:
- Backend: unit tests for `AppService`, integration test for the health endpoint
- Frontend: render test for the home page component
- API Gateway: supertest-based test for the `/health` endpoint
- Consider removing `--passWithNoTests` once initial tests are in place so the
  CI correctly fails when tests are accidentally deleted

---

## 3. Docker Compose backend build context is wrong

**Labels:** `bug`, `docker`, `devex`

`docker-compose.yml` sets `context: ./backend` for the backend service, but the
backend `Dockerfile` expects the monorepo root as context (it copies
`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, and
`backend/package.json` as relative paths from root). Same issue affects the
frontend service (`context: ./frontend`).

Both Dockerfiles reference paths like `COPY backend/package.json ./backend/`
which only work when the build context is the repo root.

**Recommendation:** Change both service build contexts to `.` (repo root):

```yaml
backend:
  build:
    context: .
    dockerfile: ./backend/Dockerfile

frontend:
  build:
    context: .
    dockerfile: ./frontend/Dockerfile
```

This matches the `docker-build.yml` GitHub Actions workflow which correctly uses
the repo root context.

---

## 4. Docker Compose is missing the api-gateway service

**Labels:** `enhancement`, `docker`

The `docker-compose.yml` defines `postgres`, `redis`, `backend`, and `frontend`
but omits `api-gateway`. The architecture documents describe a three-service
topology (frontend -> api-gateway -> backend), but local Docker development
skips the gateway entirely.

**Recommendation:** Add an `api-gateway` service to `docker-compose.yml` and
wire the frontend to route through it.

---

## 5. CI workflow repeats `pnpm install` 3 times without caching

**Labels:** `ci`, `performance`

The CI workflow (`ci.yml`) has three independent jobs -- `lint`, `test`, `build`
-- each of which runs `pnpm install --frozen-lockfile` from scratch. There is
no dependency caching (`actions/cache` or pnpm's built-in caching via
`actions/setup-node`).

**Recommendation:**
- Add pnpm store caching using `actions/setup-node`'s `cache: 'pnpm'` option
- Consider combining lint + test + build into a single job with sequential steps
  (or use a shared install job with artifact upload) to avoid 3x install overhead

---

## 6. Frontend Dockerfile produces a broken Next.js image

**Labels:** `bug`, `docker`, `frontend`

The frontend `Dockerfile` production stage copies `.next` to the container root
but runs `next start` from `/app`. It also doesn't copy the `public/` directory
(if one exists) or the `next.config.ts`. The `next start` command needs the
`.next` directory in the working directory alongside `package.json`, and it
needs access to the Next.js config.

Additionally, the `CMD` uses `node_modules/.bin/next` which depends on
`prod-dependencies` `node_modules` being present, but the COPY paths don't
align (copies to root `/app/.next` but Next.js expects it relative to the
package directory).

**Recommendation:** Align the Dockerfile paths so that `.next`, `package.json`,
`node_modules`, and `next.config.ts` are all in the same working directory in
the production stage. Consider using Next.js standalone output mode for smaller
images.

---

## 7. Health check returns untyped `object`

**Labels:** `code-quality`, `backend`

`backend/src/app.service.ts` and `app.controller.ts` use `object` as the return
type for the health check. This provides no compile-time guarantees about the
response shape and makes the Swagger/OpenAPI docs unhelpful.

**Recommendation:** Define a `HealthCheckResponse` DTO/interface:

```typescript
interface HealthCheckResponse {
  status: string
  service: string
  version: string
  timestamp: string
}
```

Use `@ApiOkResponse({ type: HealthCheckResponseDto })` on the controller for
proper OpenAPI documentation.

---

## 8. API Gateway CORS is wide open

**Labels:** `security`, `api-gateway`

`api-gateway/src/index.ts` calls `app.use(cors())` with no configuration,
allowing requests from any origin. The backend at least restricts CORS to
`process.env.FRONTEND_URL || 'http://localhost:3000'`.

**Recommendation:** Configure CORS with an explicit allowlist, matching the
backend's approach. Use environment variables so it can be configured per
environment.

---

## 9. Hardcoded version strings across multiple files

**Labels:** `tech-debt`, `devex`

The version `0.1.0` appears as a hardcoded string in:
- `backend/src/app.service.ts` (health response)
- `backend/src/main.ts` (Swagger doc)
- `api-gateway/src/index.ts` (health response)
- All three `package.json` files

These will inevitably drift. When the version is bumped in `package.json`, the
source files won't be updated.

**Recommendation:** Read the version from `package.json` at runtime (e.g.,
`import pkg from '../package.json'`) or inject it via an environment variable
during build. For the Swagger doc, use `ConfigService` to read it.

---

## 10. Backend uses `console.log` instead of NestJS Logger

**Labels:** `code-quality`, `backend`, `observability`

`backend/src/main.ts` uses `console.log()` for startup messages. NestJS provides
a built-in `Logger` class that integrates with the framework's logging system
and can be configured for structured output -- important when OpenTelemetry is
in the stack.

**Recommendation:** Replace `console.log` calls with `Logger.log()` from
`@nestjs/common`.

---

## 11. OpenTelemetry dependencies are installed but never initialized

**Labels:** `observability`, `backend`

The backend `package.json` includes `@opentelemetry/api`,
`@opentelemetry/sdk-node`, and `@opentelemetry/auto-instrumentations-node` as
dependencies, but there is no telemetry initialization code anywhere in the
backend source. These are dead dependencies.

**Recommendation:** Either implement OpenTelemetry instrumentation (create a
`tracing.ts` bootstrap file loaded via `--require`) or remove the unused
dependencies until they're needed.

---

## 12. ESLint config inconsistency across packages

**Labels:** `code-quality`, `devex`

The three packages use three different ESLint configuration approaches:
- Frontend: `.eslintrc.json` (legacy format, extends `next/core-web-vitals`)
- Backend: `eslint.config.mjs` (flat config with `@typescript-eslint` plugin)
- API Gateway: `eslint.config.mjs` (flat config, parser only, no TS plugin)

The api-gateway ESLint config uses the base `no-unused-vars` rule instead of
`@typescript-eslint/no-unused-vars`, which produces false positives on TS
constructs like interfaces and type imports. The api-gateway also doesn't
include the `@typescript-eslint` plugin at all.

**Recommendation:** Standardize ESLint configuration. Consider a shared config
in `packages/eslint-config` that all three packages extend. Ensure all TS
projects use `@typescript-eslint/no-unused-vars` instead of `no-unused-vars`.

---

## 13. Backend E2E test config references non-existent file

**Labels:** `bug`, `backend`, `testing`

`backend/package.json` defines: `"test:e2e": "jest --config ./test/jest-e2e.json"`

There is no `test/` directory or `jest-e2e.json` file in the backend package.
This command will fail if run.

**Recommendation:** Either create the `test/jest-e2e.json` config and a sample
E2E test, or remove the broken script until E2E tests are implemented.

---

## 14. No database integration in the backend

**Labels:** `enhancement`, `backend`, `database`

The backend has `DATABASE_URL` and `REDIS_URL` in its `.env.example` and Docker
Compose config, but there is no database driver, ORM, or connection code. No
TypeORM, Prisma, or Drizzle dependency. The `AppModule` only imports
`ConfigModule`.

**Recommendation:** Set up the database layer. For a NestJS project, common
choices are:
- TypeORM with `@nestjs/typeorm`
- Prisma with `prisma` + `@prisma/client`
- Drizzle ORM

Create an initial migration and connect the module.

---

## 15. No `.dockerignore` files

**Labels:** `docker`, `performance`

None of the three packages or the repo root have `.dockerignore` files. Docker
builds will copy `node_modules`, `.next`, `dist`, `.git`, and other unnecessary
files into the build context, significantly slowing down builds.

**Recommendation:** Add `.dockerignore` files (or a root-level one) excluding:
```
node_modules
.next
dist
.git
*.md
coverage
.env*
```

---

## 16. Docker Compose uses deprecated `version` key

**Labels:** `tech-debt`, `docker`

`docker-compose.yml` starts with `version: '3.8'`. Modern Docker Compose (v2)
ignores this key and emits a deprecation warning. While harmless, it's noise in
dev workflows.

**Recommendation:** Remove the `version` key.

---

## 17. No shared types package for cross-service contracts

**Labels:** `enhancement`, `architecture`

The frontend, backend, and api-gateway will inevitably share types (API request/
response shapes, enums, error codes). Currently there's no shared package, and
`packages/` is empty.

**Recommendation:** Create `packages/types` (or `packages/shared`) as the first
shared package with common API contract types. Wire it into the pnpm workspace
and Turborepo build pipeline.

---

## 18. Frontend uses deprecated `@tailwind` directives

**Labels:** `tech-debt`, `frontend`

`frontend/src/app/globals.css` uses `@tailwind base`, `@tailwind components`,
`@tailwind utilities`. While these still work in Tailwind CSS v3, the Tailwind
v4 upgrade path moves to `@import "tailwindcss"`. Worth noting for future
migration planning.

**Recommendation:** Low priority -- note this for the Tailwind v4 upgrade path.

---

## 19. Playwright E2E tests directory doesn't exist

**Labels:** `testing`, `frontend`

`frontend/playwright.config.ts` points `testDir` to `./tests`, but no `tests/`
directory exists in the frontend package. The `@playwright/test` dependency is
installed but unused.

**Recommendation:** Create the `tests/` directory with at least a basic smoke
test, or remove the Playwright dependency and config until E2E tests are planned.

---

## 20. No `api-gateway` .env.example

**Labels:** `devex`, `api-gateway`

Both the frontend and backend have `.env.example` files documenting expected
environment variables. The api-gateway has no `.env.example` despite depending
on `PORT` and (eventually) backend URL configuration.

**Recommendation:** Add `api-gateway/.env.example` with at minimum:
```
PORT=3002
BACKEND_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3000
```
