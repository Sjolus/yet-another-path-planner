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

- **Helm/Kustomize**: Each component ships with a chart that defines Deployments, Services, HPAs, PodDisruptionBudgets, resource requests/limits, and config maps. An umbrella chart wires shared values (domains, secrets, image tags).
- **Networking**: Ingress via NGINX or Traefik, TLS managed by cert-manager, optional ExternalDNS. Service mesh (Linkerd/Istio) enforces mTLS and provides traffic policy if desired.
- **Stateful Services**: PostgreSQL and Redis run as StatefulSets with PersistentVolumeClaims, backup/restore automation, and monitoring alerts. Optionally rely on external managed offerings if available.
- **Secrets & Config**: Use External Secrets Operator or SealedSecrets. Cluster-wide ConfigMaps store shared environment defaults; sensitive config remains in secrets only.

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
