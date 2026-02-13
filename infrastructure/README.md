# Infrastructure

This directory contains the Helm chart for deploying Yet Another Path Planner to Kubernetes.

## Helm Chart

The YAPP Helm chart lives at `helm/yapp/`. It is an umbrella chart that deploys all three application services plus optional in-cluster PostgreSQL and Redis.

### Architecture

```
helm/yapp/
├── Chart.yaml               # Umbrella chart with all dependencies
├── values.yaml               # Base configuration
├── values-dev.yaml           # Dev / local cluster overrides (1 replica, no HPA)
├── values-staging.yaml       # Staging overrides (2 replicas, TLS, HPA)
├── values-prod.yaml          # Production overrides (3 replicas, external DB/Redis)
├── templates/                # Shared resources (Ingress, Secrets, Traefik middleware)
└── charts/
    ├── frontend/             # Next.js 15 subchart (port 3000)
    ├── backend/              # NestJS 10 subchart (port 3001)
    ├── api-gateway/          # Express BFF subchart (port 3002)
    ├── postgresql/           # Bitnami PostgreSQL 18.3.0 (vendored)
    └── redis/                # Bitnami Redis 25.2.0 (vendored)
```

### Prerequisites

- Kubernetes 1.26+
- Helm 3.12+
- A running cluster (kind, minikube, EKS, GKE, etc.)
- An Ingress controller (Traefik by default, NGINX also supported)

### Quick Start

```bash
# Install in dev mode (1 replica, in-cluster Postgres/Redis)
helm install yapp ./infrastructure/helm/yapp \
  -f infrastructure/helm/yapp/values-dev.yaml \
  -n yapp --create-namespace

# Check pod status
kubectl get pods -n yapp

# Port-forward to access the app
kubectl port-forward svc/yapp-frontend 3000:3000 -n yapp
kubectl port-forward svc/yapp-api-gateway 3002:3002 -n yapp
```

### Installing from GHCR (Published Chart)

The chart is automatically published to GHCR via CI. To install without cloning the repo:

```bash
helm install yapp oci://ghcr.io/sjolus/yet-another-path-planner/charts/yapp \
  --version 0.1.0 \
  -n yapp --create-namespace
```

### Environment Overrides

Use the environment-specific values files to customise the deployment:

| File                 | Use Case   | Replicas | HPA/PDB  | Data Stores            |
|----------------------|------------|----------|----------|------------------------|
| `values.yaml`        | Base       | 2        | Disabled | In-cluster (Bitnami)   |
| `values-dev.yaml`    | Local/kind | 1        | Disabled | In-cluster (Bitnami)   |
| `values-staging.yaml`| Staging    | 2        | Enabled  | In-cluster (Bitnami)   |
| `values-prod.yaml`   | Production | 3        | Enabled  | External (RDS, etc.)   |

```bash
# Staging
helm install yapp ./infrastructure/helm/yapp \
  -f infrastructure/helm/yapp/values-staging.yaml \
  -n yapp-staging --create-namespace

# Production (provide real secrets)
helm install yapp ./infrastructure/helm/yapp \
  -f infrastructure/helm/yapp/values-prod.yaml \
  --set secrets.databaseUrl="postgresql://..." \
  --set secrets.redisUrl="redis://..." \
  --set secrets.jwtSecret="$(openssl rand -base64 32)" \
  --set secrets.jwtRefreshSecret="$(openssl rand -base64 32)" \
  -n yapp-prod --create-namespace
```

### Configuration Reference

#### Global Settings

| Value                          | Description                            | Default                                          |
|--------------------------------|----------------------------------------|--------------------------------------------------|
| `global.yapp.imageRegistry`   | Container registry for YAPP images     | `ghcr.io/sjolus/yet-another-path-planner`        |
| `global.yapp.imageTag`        | Image tag for all YAPP services        | `latest`                                         |
| `global.yapp.imagePullPolicy` | Image pull policy                      | `IfNotPresent`                                   |

#### Ingress

| Value               | Description                          | Default       |
|----------------------|--------------------------------------|---------------|
| `ingress.enabled`   | Enable Ingress resource              | `true`        |
| `ingress.className`  | Ingress controller (`traefik`/`nginx`) | `traefik`   |
| `ingress.hosts`     | Hostnames for routing                | `yapp.local`  |
| `ingress.tls`       | TLS configuration                    | `[]`          |

When using Traefik, the chart automatically creates a `StripPrefix` middleware to strip `/api` from requests routed to the API gateway. For NGINX, uncomment the rewrite annotations in values.yaml.

#### Secrets

| Value                      | Description               |
|----------------------------|---------------------------|
| `secrets.databaseUrl`      | PostgreSQL connection URL |
| `secrets.redisUrl`         | Redis connection URL      |
| `secrets.jwtSecret`        | JWT signing secret        |
| `secrets.jwtRefreshSecret` | JWT refresh token secret  |

For production, use External Secrets Operator or SealedSecrets instead of plain values.

#### Data Stores

| Value                | Description                              | Default |
|----------------------|------------------------------------------|---------|
| `postgresql.enabled` | Deploy in-cluster PostgreSQL             | `true`  |
| `redis.enabled`      | Deploy in-cluster Redis                  | `true`  |

Set these to `false` for production and provide external connection URLs via `secrets.databaseUrl` / `secrets.redisUrl`.

#### Per-Service Settings

Each service (frontend, backend, api-gateway) supports:

| Value                          | Description                        |
|--------------------------------|------------------------------------|
| `<service>.replicaCount`       | Number of pod replicas             |
| `<service>.resources`          | CPU/memory requests and limits     |
| `<service>.env`                | Environment variables (ConfigMap)  |
| `<service>.hpa.enabled`        | Enable Horizontal Pod Autoscaler   |
| `<service>.pdb.enabled`        | Enable PodDisruptionBudget         |
| `<service>.serviceAccount.create` | Create a dedicated ServiceAccount |

### Upgrading

```bash
helm upgrade yapp ./infrastructure/helm/yapp \
  -f infrastructure/helm/yapp/values-dev.yaml \
  -n yapp
```

### Uninstalling

```bash
helm uninstall yapp -n yapp
kubectl delete namespace yapp
```

### Updating Vendored Dependencies

The Bitnami PostgreSQL and Redis charts are vendored as directories under `charts/`. To update them:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
rm -rf infrastructure/helm/yapp/charts/postgresql infrastructure/helm/yapp/charts/redis
helm pull bitnami/postgresql --version <new-version> --untar --untardir infrastructure/helm/yapp/charts/
helm pull bitnami/redis --version <new-version> --untar --untardir infrastructure/helm/yapp/charts/
```

Then update the version fields in `Chart.yaml` to match.

### Known Limitations

- **NEXT_PUBLIC_* env vars**: Client-side environment variables are baked at Docker image build time. ConfigMap values only affect server-side rendering. To change client-side values, rebuild the frontend image.
- **Database migrations**: No Helm hook or Job for running database migrations is included yet.
- **Network Policies**: Not included; add them for production hardening.

See `docs/architecture.md` for the full deployment strategy.
