---
applyTo: "frontend/**/*.{test,spec}.{ts,tsx}"
---

# Frontend Testing Guidelines

When writing or modifying tests for the Next.js frontend, follow these guidelines:

## Test Framework

- Use **Vitest** for unit and integration tests (configured in `frontend/vitest.config.ts`)
- Use **Playwright** for E2E tests (configured in `frontend/playwright.config.ts`)

## Test File Patterns

- Unit/integration tests: `*.test.ts` or `*.test.tsx`
- E2E tests: Use Playwright's standard patterns

## Best Practices

1. **Component Testing**
   - Test user-facing behavior, not implementation details
   - Use React Testing Library patterns when testing React components
   - Mock external dependencies (API calls, external services)

2. **Test Structure**
   - Use descriptive test names that explain the expected behavior
   - Follow the Arrange-Act-Assert pattern
   - Keep tests focused and independent

3. **Running Tests**
   - Run unit tests: `cd frontend && pnpm test`
   - Run E2E tests: `cd frontend && pnpm test:e2e`
   - Tests depend on build completion (per turbo.json)

4. **Coverage**
   - Aim for meaningful coverage of critical paths
   - Don't test trivial code or framework boilerplate
   - Coverage reports are generated in `coverage/` directory

## Next.js Specific

- Test Server Components carefully - they execute on the server
- Mock Next.js router when needed
- Test Server Actions for form submissions and mutations
- Consider both SSR and CSR scenarios where applicable
