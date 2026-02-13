# Architecture & Delivery Plan

This document describes the proposed monorepo layout and the end-to-end platform needed to build, test, and deploy Yet Another Path Planner into a single self-hosted Kubernetes cluster. The goal is to ensure contributors can develop locally, promote builds through CI/CD, and operate the stack in production with modern tooling.

## Monorepo Layout

```
/
├── frontend/          # Next.js 15 (React 19, App Router, SSR/SSG)
├── backend/           # NestJS 11 or FastAPI 0.115 service layer + workers
├── api-gateway/       # tRPC/GraphQL BFF or edge routing layer
├── packages/          # Shared libraries (types, SDKs, design tokens)
├── infrastructure/    # Helm charts, Kustomize overlays, Terraform, cluster configs
├── ops/               # GitHub Actions, Argo CD app manifests, runbooks
├── docs/              # Architecture, ADRs, onboarding, runbooks
└── tools/             # Turbo/Nx pipelines, codegen, scripts, local dev utilities
```

## Core Components

- **Frontend**: Next.js 15 with the App Router, Server Components, Tailwind CSS, and shadcn/ui. Uses Server Actions for mutations and a generated API SDK from OpenAPI specs. Testing via Vitest, Playwright, and Storybook.
- **Backend**: Either NestJS (TypeScript) or FastAPI (Python) with domain-driven modules, background worker queues (BullMQ or Celery), OpenAPI + AsyncAPI specs, and OpenTelemetry instrumentation. Exposes REST + WebSocket/tRPC endpoints consumed by the frontend and external clients.
- **API Gateway / BFF**: Optional lightweight service that terminates client auth, performs schema-based validation, rate limiting, and routes traffic to backend modules. Could be implemented as an edge Next.js handler, standalone Envoy/GraphQL layer, or tRPC router.
- **Database Layer**: PostgreSQL 16 StatefulSet with Prisma or SQLAlchemy/Alembic migrations, and Redis for caching/session storage. Include backup CronJobs, monitoring, and pgBouncer for connection pooling.
- **Authentication**: Username/password auth with Argon2 hashing, refresh/access JWT pair, optional WebAuthn, and OIDC compatibility (Keycloak integration) for future federation. Secrets stored via External Secrets Operator or Sealed Secrets.

## Development Workflow

- **Package Management**: pnpm workspaces for TypeScript projects, uv/Poetry for Python if FastAPI is chosen. Turborepo or Nx orchestrates builds, linting, tests, and codegen across packages.
- **Local Environment**: Docker Compose mirrors the cluster (frontend, backend, Postgres, Redis, worker). Dev containers/VS Code setup ensures consistent tooling. Scripts located in `tools/` provide bootstrap, seeding, and smoke tests.
- **Quality Gates**: ESLint, Ruff, Prettier, TypeScript, mypy, unit/integration tests, contract tests against the OpenAPI schema, and k6 performance tests.

## CI/CD Pipeline

1. **GitHub Actions** run lint/test/build matrices, build multi-arch images with Buildx, and push to GHCR.
   - Separate workflows for code quality (`.github/workflows/ci.yml`) and Docker image builds (`.github/workflows/docker-build.yml`)
   - Docker images built for `frontend`, `backend`, and `api-gateway` components
   - Multi-architecture support: linux/amd64 and linux/arm64
   - Images tagged with: branch name, PR number, semantic version, commit SHA, and `latest` for main branch
   - Automatic push to GitHub Container Registry (ghcr.io) on push to main or version tags
   - PR builds are tested but not pushed to registry
2. **Security**: SBOM + image signing (Cosign), vulnerability scanning (Trivy/Grype), dependency review, and secret scanning.
3. **Promotion**: Upon success, manifests in `infrastructure/helm/` are updated or tagged, then Argo CD or Flux pulls from `main` and syncs the cluster. Preview environments can be created automatically with a lightweight namespace per PR.

## Kubernetes Delivery

- **Helm Umbrella Chart**: The chart at `infrastructure/helm/yapp/` deploys all components. Each application service (frontend, backend, api-gateway) is a local subchart under `charts/`. Bitnami PostgreSQL 18.3.0 and Redis 25.2.0 are vendored as `file://` dependencies. The umbrella chart wires shared values under `global.yapp.*` (image registry, tag, pull policy, backend port).
- **Environment Profiles**: `values-dev.yaml` (1 replica, no HPA), `values-staging.yaml` (2 replicas, HPA/PDB, TLS via cert-manager), and `values-prod.yaml` (3 replicas, external data stores, HPA/PDB). See `infrastructure/README.md` for full configuration reference.
- **Networking**: Path-based Ingress routes `/api` to the api-gateway and `/` to the frontend. Traefik is the default controller with an auto-created `StripPrefix` middleware; NGINX annotation examples are included in values.yaml. Backend is cluster-internal only (not exposed via Ingress), matching the BFF pattern.
- **Stateful Services**: In-cluster PostgreSQL and Redis are deployed via Bitnami subcharts with PersistentVolumeClaims. For production, set `postgresql.enabled: false` / `redis.enabled: false` and provide external connection URLs via `secrets.databaseUrl` / `secrets.redisUrl`.
- **Secrets & Config**: Plain Kubernetes Secrets for database URLs, Redis URLs, and JWT secrets. Production deployments should use External Secrets Operator or SealedSecrets. Each service also has a ConfigMap for non-sensitive environment variables.
- **Chart Publishing**: The Helm chart is published to GHCR as an OCI artifact via `.github/workflows/helm-publish.yml`. Install with: `helm install yapp oci://ghcr.io/sjolus/yet-another-path-planner/charts/yapp --version 0.1.0`.

## Observability & Ops

- **Telemetry Stack**: OpenTelemetry SDKs and collectors run in every service, exporting spans, metrics, and logs through the Grafana Agent into the LGTM stack (Loki, Grafana, Tempo, Mimir) hosted in Grafana Cloud. A lightweight in-cluster Prometheus scrapes critical pods for redundancy and forwards to Grafana Cloud when connectivity is available.
- **Alerting**: Alertmanager (or Grafana Alerting) routes alerts to chat/email with runbook links from `docs/runbooks/`.
- **Dashboards**: Grafana dashboards cover auth flows, API latency, worker queues, DB health, and frontend Core Web Vitals. Tempo views enable trace-to-log correlation, and exemplars connect metrics to traces.
- **Operational Tasks**: `ops/` contains runbooks, incident templates, and scripts for migrations, log gathering, and synthetic monitoring via k6 or Checkly.

## Documentation & Governance

- **ADRs**: Capture architectural decisions under `docs/adrs/` to track major technology choices.
- **Onboarding**: `docs/onboarding.md` documents environment setup, required tooling, and local workflows.
- **Security & Compliance**: Maintain a security checklist (threat model, dependency review process, key rotation). Regular dependency updates via Renovate or Dependabot.
- **Roadmap**: Track upcoming milestones and features in `docs/roadmap.md` or GitHub Projects.

This plan keeps every artifact—code, infrastructure, and operations—inside a single monorepo, enabling consistent review, automated testing, and one-click deployment into a Kubernetes cluster.
