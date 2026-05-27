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

## Features (planned)

- Student dashboard
- Course catalog + smart search
- Lesson player
- Interactive quiz
- Real-time progress
- Favorites + history
- Dark mode
- Notifications
- Simple analytics

## Tech stack

- Angular (standalone)
- Angular Material + TailwindCSS
- RxJS
- Mock backend: JSON Server (planned)
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

Build:

```bash
npm run build
```

Unit tests:

```bash
npm test
```

## Project structure

```
src/app
	core/        services, guards, interceptors, models
	shared/      reusable components/pipes/directives
	features/    dashboard, courses, quiz, profile, analytics
	state/       signal stores (auth, courses, ui)
```
