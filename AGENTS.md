# Custom Agents for Yet Another Path Planner

This file documents the custom agent profiles that can be created for specialized tasks in this repository. Custom agents provide focused expertise and tailored tool configurations for specific workflows.

For more information on creating custom agents, see the [GitHub Copilot documentation](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents).

## Recommended Custom Agents

### 1. Testing Specialist

**Purpose**: Focused on test quality, coverage, and testing best practices across all components.

**Expertise**:
- Vitest and Playwright for frontend testing
- Jest for backend and API gateway testing
- Test-driven development patterns
- Coverage analysis and improvement

**Tool Access**: Read, search, and edit tools only (no build or deploy tools)

**Use Cases**:
- "Improve test coverage for authentication module"
- "Add E2E tests for user registration flow"
- "Review and enhance existing test suite"

### 2. Documentation Expert

**Purpose**: Specialized in creating and maintaining comprehensive project documentation.

**Expertise**:
- Technical writing and documentation standards
- Markdown formatting and structure
- API documentation generation
- Architecture Decision Records (ADRs)
- Keeping documentation synchronized with code

**Use Cases**:
- "Update architecture.md with new telemetry configuration"
- "Create ADR for database migration strategy"
- "Review and improve onboarding documentation"

### 3. Frontend Specialist

**Purpose**: Expert in Next.js 15, React 19, and modern frontend patterns.

**Expertise**:
- Next.js App Router and Server Components
- React 19 features and hooks
- Tailwind CSS and responsive design
- Frontend performance optimization
- Accessibility best practices

**Use Cases**:
- "Implement user dashboard with Server Components"
- "Optimize image loading performance"
- "Add accessibility features to navigation component"

### 4. Backend Specialist

**Purpose**: Expert in NestJS, API design, and backend architecture.

**Expertise**:
- NestJS modules, controllers, and services
- RESTful API design
- Database design and optimization
- OpenTelemetry instrumentation
- Authentication and authorization

**Use Cases**:
- "Create flight tour management API endpoints"
- "Implement user authentication with JWT"
- "Add OpenTelemetry tracing to new service"

### 5. DevOps Specialist

**Purpose**: Expert in CI/CD, Docker, Kubernetes, and infrastructure.

**Expertise**:
- GitHub Actions workflows (ci.yml, docker-build.yml, helm-publish.yml)
- Docker multi-stage builds
- Helm umbrella chart at `infrastructure/helm/yapp/` with per-service subcharts
- Bitnami vendored dependencies (PostgreSQL, Redis) managed via `file://` references
- Environment-specific values files (values-dev.yaml, values-staging.yaml, values-prod.yaml)
- Traefik/NGINX Ingress configuration and path-based routing
- Monitoring and observability setup (OpenTelemetry, Grafana LGTM)

**Key Files**:
- `infrastructure/helm/yapp/Chart.yaml` — umbrella chart dependencies
- `infrastructure/helm/yapp/values.yaml` — base configuration (uses `global.yapp.*` namespace)
- `infrastructure/helm/yapp/charts/*/templates/` — per-service Kubernetes resources
- `.github/workflows/helm-publish.yml` — chart publishing to GHCR
- `infrastructure/README.md` — end-user deployment guide

**Use Cases**:
- "Add Helm subchart for a new service"
- "Update Docker build workflow for new component"
- "Configure Grafana dashboard for API metrics"
- "Modify Ingress routing for new API paths"
- "Update Bitnami dependency versions"

### 6. Security Reviewer

**Purpose**: Focused on security best practices and vulnerability prevention.

**Expertise**:
- Security code review
- OWASP top 10 awareness
- Dependency vulnerability scanning
- Authentication and authorization patterns
- Secrets management

**Tool Access**: Read and search only (no code modifications)

**Use Cases**:
- "Review authentication implementation for security issues"
- "Audit new API endpoints for security vulnerabilities"
- "Check for hardcoded secrets or credentials"

## Creating a Custom Agent

To create a custom agent, use the GitHub Copilot interface or API to define:

1. **Agent Profile**: Name, description, and expertise areas
2. **Tool Access**: Which tools the agent can use
3. **Instructions**: Specific guidelines and constraints
4. **Scope**: What parts of the codebase it should focus on

## Agent Usage Examples

```markdown
@copilot-testing-specialist: Add comprehensive unit tests for the flight tour service

@copilot-docs-expert: Create an ADR for our choice of OpenTelemetry over proprietary monitoring

@copilot-frontend: Implement the flight tour search interface with Server Components

@copilot-backend: Create REST API endpoints for managing user flight tours

@copilot-devops: Update CI workflow to include security scanning

@copilot-security: Review the authentication flow for potential vulnerabilities
```

## Notes

- Custom agents inherit MCP server tools configured in the repository
- Agents can be configured to only access specific tools for safety
- Use specialized agents for recurring workflows that need domain expertise
- Agents should follow all guidelines in `.github/copilot-instructions.md`
