---
applyTo: "api-gateway/**/*.spec.ts"
---

# API Gateway Testing Guidelines

When writing or modifying tests for the Express API Gateway, follow these guidelines:

## Test Framework

- Use **Jest** for all API Gateway tests (configured in `api-gateway/package.json`)

## Test File Patterns

- Unit tests: `*.spec.ts`
- Integration tests: `test/*.spec.ts`

## Best Practices

1. **Express Middleware Testing**
   - Test middleware functions in isolation
   - Mock request, response, and next function
   - Verify authentication, validation, and rate limiting logic
   - Test error handling paths

2. **Request/Response Testing**
   - Use supertest for HTTP assertions
   - Test routing logic and request transformation
   - Verify response formatting and status codes
   - Test header manipulation and CORS

3. **Integration with Backend**
   - Mock backend service calls
   - Test request forwarding and response aggregation
   - Verify circuit breaker and retry logic if implemented
   - Test timeout handling

4. **Running Tests**
   - Run tests: `cd api-gateway && pnpm test`
   - Tests depend on build completion (per turbo.json)

5. **BFF Patterns**
   - Test client-specific response shaping
   - Verify schema validation against OpenAPI specs
   - Test authentication token handling
   - Verify rate limiting and throttling

## Security Testing

- Test authentication and authorization flows
- Verify input sanitization and validation
- Test CSRF protection if applicable
- Verify secure headers are set correctly
