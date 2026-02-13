# Developer Onboarding

Use this guide to bootstrap a local development environment that mirrors the production-ready monorepo layout described in `docs/architecture.md`.

## 1. Prerequisites

1. **Accounts**
   - GitHub account with access to the repository.
   - Grafana Cloud employee account for LGTM (Loki, Grafana, Tempo, Mimir) telemetry ingestion.
2. **Tooling**
   - Node.js 20 LTS and pnpm 9.
   - Docker and Docker Compose (or Colima/Rancher Desktop on macOS).
   - Python 3.12 with `uv` or `poetry` if contributing to FastAPI services.
   - `kubectl`, `helm`, and `kustomize` for cluster interactions.
   - Optional: `kind` or `minikube` for local cluster testing, and `Tilt` for rapid Kubernetes sync loops.
3. **Git Hooks**
   - Install `pre-commit` to run lint/format checks before each commit (`pipx install pre-commit`).

## 2. Repository Setup

```bash
# clone the monorepo
git clone git@github.com:Sjolus/yet-another-path-planner.git
cd yet-another-path-planner

# install JS dependencies
docker run --rm pnpm/pnpm:9 pnpm --version  # optional check
pnpm install

# install Python tooling if needed
uv venv  # or python -m venv .venv
source .venv/bin/activate
uv pip install -r backend/requirements-dev.txt

# install pre-commit hooks
pre-commit install
```

## 3. Environment Configuration

1. Copy the provided environment examples and adjust for your workspace:
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
2. Populate secrets with safe dummy values for local work. Production secrets are injected via External Secrets Operator / SealedSecrets.
3. Set Grafana Cloud credentials (instance URL, API token, stack ID) in `.env.telemetry` and reference them from Docker Compose or `helm` values when testing telemetry pipelines.

## 4. Local Development Workflow

1. **Docker Compose**
   ```bash
   docker compose up --build backend frontend worker db redis grafana-agent
   ```
   This spins up Postgres, Redis, backend API, frontend app, async workers, and the Grafana Agent that forwards OTEL data to Grafana Cloud (or Loki/Tempo containers if you run them locally).
2. **Frontend**
   ```bash
   cd frontend
   pnpm dev
   ```
3. **Backend** (NestJS example)
   ```bash
   cd backend
   pnpm start:dev  # or uv run fastapi main.py if using Python
   ```
4. **Workers / Schedulers**: Launch the worker process defined in `backend/apps/worker` to process queues.
5. **Cluster Parity**: Use `kind` or `minikube` with the Helm chart for full-cluster smoke tests:
   ```bash
   kind create cluster --name yapp
   helm install yapp ./infrastructure/helm/yapp \
     -f infrastructure/helm/yapp/values-dev.yaml \
     -n yapp --create-namespace
   kubectl get pods -n yapp
   ```
   See `infrastructure/README.md` for full Helm chart documentation.

## 5. Quality & Verification

- `pnpm lint` runs ESLint, Ruff (via `uv run ruff check`), and Prettier formatting checks.
- `pnpm test` executes unit tests across packages via Turborepo/Nx.
- `pnpm test:e2e` or `pnpm exec playwright test` runs browser automation for the frontend.
- `make verify` (to be added) will wrap lint + test + type-check before CI.
- Contract tests (`pnpm openapi:check`) ensure clients stay aligned with the API schema.

## 6. Telemetry & LGTM Integration

1. All services emit OTEL spans/metrics/logs via OTLP.
2. The Grafana Agent (deployed via Helm or Docker Compose) forwards OTLP traffic to Grafana Cloud where the LGTM stack stores and visualizes the data.
3. For offline/local-only development, switch the agent config to route metrics to the bundled Prometheus instance and logs/traces to local Loki/Tempo containers.
4. Dashboards and alert rules live under `ops/grafana/`. Export/import them to Grafana Cloud as part of reviewable PRs.

## 7. Troubleshooting

- **Dependency mismatches**: run `pnpm dlx turbo prune --scope <app>` to trim node_modules for isolated debugging.
- **Database resets**: `pnpm db:reset` (wraps Prisma/Alembic migrations) drops and recreates schemas.
- **Telemetry not visible**: confirm the Grafana Agent has connectivity, the OTLP endpoint/token are correct, and ports 4317/4318 are reachable from containers.
- **Kubernetes sync issues**: `kubectl describe` the Argo CD Application or Flux Kustomization and check `kubectl get events -A` for RBAC or image-pull failures.

## 8. Docker Images & CI/CD

Docker images for all components (frontend, backend, api-gateway) are automatically built and published to GitHub Container Registry through CI/CD:

- **Workflow**: `.github/workflows/docker-build.yml` builds multi-arch images (linux/amd64, linux/arm64)
- **Registry**: Images are published to `ghcr.io/sjolus/yet-another-path-planner/{component}`
- **Tagging Strategy**:
  - `latest` — most recent build from main branch
  - `main` — branch name for main branch builds
  - `sha-{commit}` — specific commit SHA (e.g., `sha-764682f`)
  - `v{version}` — semantic version tags (e.g., `v1.2.3`, `v1.2`, `v1`)
  - `pr-{number}` — PR builds (built but not pushed to registry)
- **Local Testing**: Each component has a Dockerfile for local builds and docker-compose.yml orchestrates the full stack

To pull and run a published image:

```bash
docker pull ghcr.io/sjolus/yet-another-path-planner/backend:latest
docker pull ghcr.io/sjolus/yet-another-path-planner/frontend:latest
docker pull ghcr.io/sjolus/yet-another-path-planner/api-gateway:latest
```

**Helm Chart Publishing**: The Helm chart is also published to GHCR as an OCI artifact via `.github/workflows/helm-publish.yml`. To install the published chart:

```bash
helm install yapp oci://ghcr.io/sjolus/yet-another-path-planner/charts/yapp --version 0.1.0
```

## 9. Helpful References

- `docs/architecture.md` — full component plan.
- `docs/adrs/` — rationale behind major decisions (add entries as the system evolves).
- `infrastructure/helm/yapp/` — Helm umbrella chart for Kubernetes deployment.
- `infrastructure/README.md` — Helm chart usage guide, configuration reference, and deployment instructions.
- `ops/runbooks/` — operational guides (to be expanded alongside feature work).
- `.github/workflows/` — CI/CD workflows for testing, linting, Docker builds, and Helm chart publishing.

Feel free to open a discussion or GitHub issue if any onboarding step is unclear or needs automation.
