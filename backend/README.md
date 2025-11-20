# Backend

NestJS 10 API service with OpenAPI documentation and OpenTelemetry instrumentation.

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

The API will be available at [http://localhost:3001](http://localhost:3001).  
OpenAPI documentation: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

## Scripts

- `pnpm dev` - Start development server with watch mode
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm start:prod` - Start production build
- `pnpm lint` - Run ESLint
- `pnpm test` - Run unit tests with Jest
- `pnpm test:e2e` - Run E2E tests
- `pnpm test:cov` - Run tests with coverage

## Tech Stack

- NestJS 10
- TypeScript
- OpenAPI/Swagger
- OpenTelemetry
- Jest for testing
