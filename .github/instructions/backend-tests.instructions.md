---
applyTo: "backend/**/*.spec.ts"
---

# Backend Testing Guidelines

When writing or modifying tests for the NestJS backend, follow these guidelines:

## Test Framework

- Use **Jest** for all backend tests (configured in `backend/package.json`)
- NestJS provides testing utilities via `@nestjs/testing`

## Test File Patterns

- Unit tests: `*.spec.ts`
- E2E tests: `test/*.e2e-spec.ts`

## Best Practices

1. **Unit Testing with NestJS**
   - Use `Test.createTestingModule()` to create test modules
   - Mock dependencies using Jest mocks or custom providers
   - Test controllers, services, and providers in isolation
   - Use constructor-based dependency injection for easy mocking

2. **E2E Testing**
   - E2E tests should test complete request/response cycles
   - Use supertest for HTTP assertions
   - Spin up a test application with `app.init()`
   - Clean up test data after each test

3. **Test Structure**
   - Use descriptive `describe` and `it` blocks
   - One assertion per test when possible
   - Use `beforeEach` and `afterEach` for setup/teardown
   - Keep tests independent and idempotent

4. **Running Tests**
   - Run unit tests: `cd backend && pnpm test`
   - Run with coverage: `cd backend && pnpm test:cov`
   - Run E2E tests: `cd backend && pnpm test:e2e`
   - Tests depend on build completion (per turbo.json)

5. **NestJS Patterns**
   - Test decorators and guards thoroughly
   - Mock external services (database, Redis, external APIs)
   - Test validation pipes and transformation logic
   - Verify OpenTelemetry instrumentation in integration tests

## Database Testing

- Use test database or in-memory database for tests
- Reset database state between tests
- Consider using transactions that roll back after tests
