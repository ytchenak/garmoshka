# Garmoshka

A web application for capturing and processing visual meteor observations in the [IMO](https://www.imo.net/) format.

Site: https://garmoshka-meteors.firebaseapp.com

## Tech Stack

- **Angular 19** with standalone components
- **TypeScript 5.7** with strict mode
- **ESLint** (angular-eslint) with zero-warning policy
- **Karma/Jasmine** for unit tests
- **Playwright** for E2E tests (desktop + mobile)
- **GitHub Actions** CI pipeline

## Development

```bash
npm install
npm start           # Dev server at http://localhost:4200/
npm run lint        # ESLint
npm test            # Unit tests
npm run e2e         # Playwright E2E tests
npm run build       # Production build
```

## Build & Deploy

```bash
npm run build
npm install -g firebase-tools
firebase login
firebase deploy
```

