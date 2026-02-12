---
applyTo: "backend/**/*.ts"
---

# Backend Development Guidelines

When working on the NestJS backend, follow these guidelines:

## Architecture

- **Framework**: NestJS 10 with Express
- **Language**: TypeScript with decorator-based patterns
- **API Documentation**: Swagger/OpenAPI with automated spec generation
- **Observability**: OpenTelemetry instrumentation required

## Directory Structure

- `src/` - Application source code
  - `modules/` - Feature modules (controllers, services, providers)
  - `common/` - Shared utilities, decorators, guards, pipes
  - `config/` - Configuration modules
  - `main.ts` - Application bootstrap

## Code Style

- **TypeScript**: Looser strictness for NestJS decorator conventions
- **Prettier**: No semicolons, single quotes, 2-space indent, 100-char line width
- **ESLint**: `@typescript-eslint` configuration

## Best Practices

1. **Module Organization**
   - Follow domain-driven design principles
   - One module per feature or domain concept
   - Use barrel exports (`index.ts`) for clean imports

2. **Dependency Injection**
   - Use constructor-based injection
   - Leverage NestJS providers and scopes
   - Mock dependencies in tests using custom providers

3. **Controllers**
   - Keep controllers thin - delegate business logic to services
   - Use DTOs for request/response validation
   - Document endpoints with Swagger decorators

4. **Services**
   - Implement business logic in services
   - Use transactions for multi-step database operations
   - Handle errors appropriately and throw custom exceptions

5. **Validation**
   - Use `class-validator` for DTO validation
   - Use ValidationPipe globally for automatic validation
   - Provide meaningful error messages

6. **OpenTelemetry**
   - All services must emit OTEL spans, metrics, and logs
   - Use context propagation for distributed tracing
   - Update Grafana/LGTM configs when adding/removing services

7. **Database**
   - Use migrations for schema changes
   - Never commit raw credentials
   - Use connection pooling (pgBouncer)

## Commands

```bash
cd backend
pnpm start:dev    # Start dev server with hot reload (port 3001)
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm test         # Run Jest unit tests
pnpm test:cov     # Run tests with coverage
pnpm test:e2e     # Run E2E tests
```
