# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## LiveSafe App (`artifacts/livesafe`)

React + Vite crime prediction app with role-based access control.

### Auth & Roles
- **Demo accounts** (bypass Supabase): `citizen@example.com/citizen123`, `police@example.com/police123`, `admin@example.com/admin123`
- Roles: **citizen** (green), **police** (blue), **admin** (amber)
- Session stored in `sessionStorage` via `tokenStore`; restored on page reload

### Role-Gated Navigation
| Screen | Citizen | Police | Admin |
|--------|---------|--------|-------|
| Dashboard, Map, Prediction Models, Reports | ✓ | ✓ | ✓ |
| Report Incident | ✓ | — | — |
| SOS Alerts | — | ✓ | ✓ |
| Analytics | — | ✓ | ✓ |
| ML Dashboard | — | — | ✓ |
| User Management | — | — | ✓ |

### Data
- `VITE_USE_MOCK=false` but all endpoints gracefully fall back to mock data when Supabase tables don't exist
- Supabase used for auth; data endpoints use NCRB mock data by default

### Key Files
- `src/App.tsx` — router with `ProtectedRoute` wrappers
- `src/components/new-ui/App.tsx` — main app shell (sidebar, header, RBAC nav)
- `src/app/hooks/useAuth.tsx` — auth context
- `src/app/services/api.ts` — API service with demo login + mock fallback
- `src/components/layout/AppLayout.tsx` — layout for role-specific standalone pages
