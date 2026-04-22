# LiveSafe

LiveSafe is a PNPM monorepo containing:

- `artifacts/livesafe`: React + Vite frontend
- `artifacts/api-server`: Node/Express API server
- `lib/*`: shared libraries (DB schema, API clients, Zod types)

## Prerequisites

- Node.js 22+
- PNPM 10+

## Install

```bash
pnpm install
```

## Run Frontend (local dev)

The frontend Vite config requires these environment variables:

- `PORT`
- `BASE_PATH`

Example:

```bash
MSYS_NO_PATHCONV=1 PORT=5173 BASE_PATH=/ pnpm --filter @workspace/livesafe dev
```

Then open:

- `http://localhost:5173/` (or next free port if 5173 is occupied)

## Run API Server (local dev)

```bash
pnpm --filter @workspace/api-server dev
```

## Typecheck

```bash
pnpm run typecheck
```

## Build

```bash
pnpm run build
```

## Workspace scripts

- Root typecheck: `pnpm run typecheck`
- Root build: `pnpm run build`

