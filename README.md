# Study Buddy (EdTech Student Portal)

Modern Angular practice project (Angular 21+), designed as an “edtech portal” similar in spirit to large learning platforms.

## Why this project

This repository is meant to practice **new Angular patterns** used in modern codebases:

- Standalone components + `loadComponent` routing (no NgModules)
- Signals for local and shared state
- RxJS for async streams (search, timers, real-time progress)
- Built-in control flow: `@if`, `@for`, `@switch`
- Deferrable views: `@defer`
- Functional guards / interceptors and `inject()`
- (Optional, advanced) Zoneless migration

## Modern vs legacy Angular (quick guide)

- **NgModules → Standalone**: no `AppModule`/feature modules; components declare `imports: [...]`, and app setup happens via `ApplicationConfig` + functional providers.
- **Router**: prefer `loadComponent` routes (lazy by default) instead of module-based lazy loading.
- **Templates**: built-in control flow (`@if`, `@for`, `@switch`) instead of `*ngIf/*ngFor/*ngSwitch`.
- **State**: signals (`signal`, `computed`, `effect`) for local/shared state; RxJS still shines for streams (debounced search, timers). Use `toSignal/toObservable` to bridge.
- **DI**: `inject()` inside classes/functions instead of constructor-only patterns when it improves ergonomics.
- **Providers**: `provideHttpClient`, `provideRouter`, functional interceptors/guards (vs NgModule config).
- **Deferrable views**: `@defer` for progressive rendering without manual lazy components.

## Features

- Student dashboard (recent activity)
- Course catalog + smart search
- Course detail + lesson list
- Lesson player + real-time progress
- Interactive quiz runner (timed)
- Favorites + history
- Dark mode
- Simple analytics
- Notifications (next)

## Tech stack

- Angular (standalone)
- Angular Material + TailwindCSS
- RxJS
- Mock backend: JSON Server (`mock/db.json`) + dev proxy (`/api`)
- Request caching (client-side memoization)
- E2E: Cypress (planned)

## Getting started

Prereqs: Node 20 LTS.

Install:

```bash
npm install
```

Run dev server:

```bash
npm start
```

Run mock API (JSON Server):

```bash
npm run api
```

The Angular dev server proxies `/api/*` to the mock API (see `proxy.conf.json`).

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Unit tests:

```bash
npm test
```

Run tests once (non-watch):

```bash
npm test -- --watch=false
```

## Project structure

```
src/app
	core/        services, guards, interceptors, models
	shared/      reusable components/pipes/directives
	features/    dashboard, courses, quiz, profile, analytics
	state/       signal stores (auth, courses, ui)
```
