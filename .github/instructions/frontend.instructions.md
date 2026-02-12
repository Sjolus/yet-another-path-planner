---
applyTo: "frontend/**/*.{ts,tsx,css}"
---

# Frontend Development Guidelines

When working on the Next.js 15 frontend, follow these guidelines:

## Architecture

- **Framework**: Next.js 15 with App Router (not Pages Router)
- **React**: Version 19 with Server Components
- **Styling**: Tailwind CSS with utility-first approach
- **Components**: Use shadcn/ui patterns where applicable

## Directory Structure

- `src/app/` - App Router pages and layouts
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions and shared logic
- `src/styles/` - Global styles and Tailwind config

## Code Style

- **TypeScript**: Strict mode enabled
- **Prettier**: No semicolons, single quotes, 2-space indent, 100-char line width
- **ESLint**: Next.js defaults, fix all warnings before committing

## Best Practices

1. **Server vs Client Components**
   - Default to Server Components for better performance
   - Use `'use client'` directive only when needed (interactivity, hooks, browser APIs)
   - Keep client components small and focused

2. **Data Fetching**
   - Use Server Components for data fetching when possible
   - Use Server Actions for mutations
   - Generate API SDK from OpenAPI specs for type safety

3. **Routing**
   - Use App Router conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
   - Use route groups `(groupName)` to organize without affecting URL structure
   - Use `Link` from `next/link` for client-side navigation

4. **Styling**
   - Prefer Tailwind utility classes over custom CSS
   - Use CSS modules for component-specific styles when needed
   - Follow mobile-first responsive design principles

5. **Performance**
   - Optimize images with `next/image`
   - Use dynamic imports for code splitting
   - Implement proper loading states
   - Monitor Core Web Vitals

## Commands

```bash
cd frontend
pnpm dev          # Start dev server (port 3000)
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm test         # Run Vitest tests
pnpm test:e2e     # Run Playwright E2E tests
```
