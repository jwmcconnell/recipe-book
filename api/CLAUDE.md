# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Recipe Book API - a NestJS TypeScript REST API.

## Commands

```bash
npm run start:dev    # Development server with hot reload
npm run build        # Build for production
npm run start:prod   # Run production build

npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run e2e tests

npm run lint         # Lint and fix
npm run format       # Format with Prettier
```

Run a single test file:
```bash
npx jest path/to/file.spec.ts
```

## Architecture

NestJS modular architecture:

```
src/
  main.ts              # Bootstrap, creates app and listens on port 3000
  app.module.ts        # Root module, imports all feature modules
  app.controller.ts    # Root controller
  app.service.ts       # Root service

test/
  app.e2e-spec.ts      # E2E tests using supertest
```

Key patterns:
- Modules group related controllers and services
- Controllers handle HTTP routes, delegate to services
- Services contain business logic, are injectable
- Use `@nestjs/testing` Test.createTestingModule() for unit tests
