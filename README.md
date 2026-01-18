# Recipe Book

A recipe management application with a React frontend and NestJS API.

## Live URLs

- Web: https://recipe-helper.dev
- API: https://recipe-helper-api-production.up.railway.app

## Development

```bash
make install    # Install dependencies
make dev        # Run both apps locally
```

Or run individually:
```bash
make dev-api    # API on port 3000
make dev-web    # Web on Vite dev server
```

## Testing

```bash
make test       # Run all tests
make test-api   # API tests only
make test-web   # Web tests only
```

## Deployment

Trunk-based development - push to `main` triggers:
- Tests run in parallel for both apps
- On success, deploys web to Netlify and API to Railway

See `.github/workflows/deploy.yml` for details.
