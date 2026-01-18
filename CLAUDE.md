# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Recipe Book - a monorepo with two applications:
- `api/` - NestJS backend (TypeScript, Jest) → https://recipe-helper-api-production.up.railway.app
- `web/` - React frontend (TypeScript, Vite, Vitest, Tailwind CSS v4) → https://recipe-helper.dev

## Deployment

Trunk-based development. Push to `main` triggers `.github/workflows/deploy.yml`:
- Tests run in parallel for both apps
- On success, deploys web to Netlify and API to Railway

## Commands

From project root using Makefile:
```bash
make install      # Install dependencies for both apps
make dev          # Run both apps in development mode
make dev-api      # Run only API (port 3000)
make dev-web      # Run only web (Vite dev server)
make test         # Run all tests
make test-api     # Run API tests only
make test-web     # Run web tests only
make lint         # Lint both apps
make build        # Build both apps
```

Run a single test:
```bash
# API (Jest)
cd api && npx jest path/to/file.spec.ts

# Web (Vitest)
cd web && npx vitest path/to/file.test.ts
```

## Architecture

```
recipe-book/
├── api/                    # NestJS backend
│   └── src/
│       ├── main.ts             # Bootstrap (port 3000)
│       ├── app.module.ts       # Root module
│       ├── auth/               # Clerk JWT authentication
│       │   ├── auth.guard.ts       # Route guard
│       │   └── auth.service.ts     # Token verification
│       ├── prisma/             # Database access
│       │   └── prisma.service.ts
│       └── recipes/            # Recipe CRUD
│           ├── recipes.controller.ts
│           ├── recipes.service.ts
│           └── recipe-repository.ts  # Nullable for testing
│
└── web/                    # React frontend
    └── src/
        ├── App.tsx             # View state (list/detail/create/edit)
        ├── domain/             # Domain models (Recipe)
        ├── components/
        │   ├── RecipeCard.tsx      # Compact card for list view
        │   ├── RecipeList.tsx      # Grid of recipe cards
        │   ├── RecipeDetail.tsx    # Full recipe view
        │   ├── RecipeForm.tsx      # Create/edit form
        │   └── ui/                 # shadcn/ui components
        └── lib/
            └── api.ts              # API client (CRUD operations)
```

### API (NestJS)
- Modules group controllers and services
- Controllers handle HTTP, services contain business logic
- Unit tests: `*.spec.ts` with `@nestjs/testing`
- E2E tests: `test/app.e2e-spec.ts` with supertest

### Web (React)
- Domain layer: `src/domain/` contains domain models as classes
- UI: shadcn/ui components with Tailwind CSS v4
- Path alias: `@/` maps to `src/`
- Tests: `*.test.ts(x)` with Vitest and Testing Library
