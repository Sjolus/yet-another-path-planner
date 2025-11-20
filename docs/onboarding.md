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
5. **Cluster Parity**: Use `kind` + `helm install -f infrastructure/helm/values.dev.yaml chart-name ./infrastructure/helm` for full-cluster smoke tests.

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

## 8. Helpful References

- `docs/architecture.md` — full component plan.
- `docs/adrs/` — rationale behind major decisions (add entries as the system evolves).
- `infrastructure/helm/` — manifests for the cluster.
- `ops/runbooks/` — operational guides (to be expanded alongside feature work).

Feel free to open a discussion or GitHub issue if any onboarding step is unclear or needs automation.
