# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run lint         # ESLint check
npm run lint:fix     # Fix ESLint issues
npm run check-types  # TypeScript type checking (tsc --noEmit)
npm run db:sync      # Run database schema migrations
```

Pre-commit hooks run `lint-staged` (Prettier + ESLint on staged files) via Husky.

## Architecture

**Next.js 15 App Router** application with React 19, TypeScript (strict mode), and Tailwind CSS v4.

### Directory Structure

- `src/app/` — App Router pages and API routes
  - `api/auth/` — Auth endpoints (login, signup, logout, refresh, me)
  - `(app)/` — Protected routes (studio, checkout)
  - `(account-layout)/` — Account management routes
- `src/modules/` — Feature modules (auth, app, account, checkout, contact, landing), each containing components, hooks, and module-specific logic
- `src/shared/` — Reusable components, hooks, providers, types, constants, stores, utils
- `src/services/` — Business logic (e.g., `auth.service.ts`)
- `src/repositories/` — Data access layer for Neon Postgres
- `src/libs/` — Library wrappers (DB connection, API clients, logger, migrations)
- `common/` — Shared types/constants importable as `@common`
- `tailwind-config/` — Tailwind CSS configuration and brand styles

### Path Aliases (tsconfig)

- `@/*` → `./src/*`
- `@tailwind-config/*` → `./tailwind-config/*`
- `@common` → `./common`

### Key Patterns

**Auth**: JWT-based with HTTP-only cookies. Service → Repository pattern over Neon Postgres. Middleware protects `/studio` routes by checking `ACCESS_TOKEN` cookie.

**State Management**: Jotai (global atoms), TanStack React Query (server state), React Hook Form (forms), nuqs (URL search params).

**API Clients**: `src/libs/api-client.ts` (client-side Axios wrapper), `src/libs/api-server.ts` (server-side). API routes defined in `common/constants/api-base-routes.ts`.

**Database**: Neon Postgres via `@neondatabase/serverless` with pool-based connections. Migrations are registry-based in `migrations-registry.ts`, executed via `/api/setup`.

**UI**: Radix UI primitives, Phosphor Icons, sonner for toasts. Class merging utility at `tailwind-config/utils/cn.ts`.

## Environment Variables

See `.env.example`: `DATABASE_URL`, `SESSION_EXPIRY_SECONDS`, `NEXT_PUBLIC_API_BASE_URL`, `JWT_REFRESH_TOKEN_EXPIRATION`.

## Code Style

- ESLint flat config with TypeScript ESLint, Next.js rules, and Prettier integration
- `consistent-type-imports` enforced (use `import type` for type-only imports)
- Prettier: 100 char width, 2-space tabs, semicolons, Tailwind class sorting plugin
