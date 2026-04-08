# Abroad Study Dashboard

Minimal professional dashboard built from the original abroad-study dossier and converted into a structured web app.

## Stack

- `Next.js 16.2.2`
- `React 19.2.4`
- `Tailwind CSS v4`
- App Router

Official reference used for the latest Next.js baseline:
- [Next.js blog](https://nextjs.org/blog)
- [Next.js App Router docs](https://nextjs.org/docs/app/getting-started/installation)

## What this app does

- maps the full dossier into a dashboard
- adds a browser-persisted control center for degree target, readiness, and country focus
- adds a kanban + table tracker for shortlist, stages, deadlines, and notes
- shows country-level priority and programme density
- gives a filterable programme explorer with quick shortlist controls
- groups scholarships by country
- exposes common documents and planning docs in a readable UI
- keeps a self-contained content snapshot inside the app repo

## Project structure

- `content/dossier/` — embedded snapshot of the original markdown/csv dossier
- `src/lib/dossier.ts` — parser and typed data layer
- `src/app/` — App Router routes
- `src/components/` — dashboard UI components

## Main routes

- `/` — overview dashboard
- `/control` — editable planning layer stored in browser local storage
- `/tracker` — application tracker board and table
- `/countries` — country grid
- `/countries/[slug]` — country detail with universities and programme cards
- `/programs` — filterable programme explorer
- `/scholarships` — funding board
- `/documents` — common-documents and planning-docs hub

## Local development

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
pnpm lint
pnpm build
```

## Deployment

Deploy to Vercel from the project root:

```bash
vercel deploy -y
```

## Source lineage

Original dossier repo:
- [sunny-arya-codes/foreign-install](https://github.com/sunny-arya-codes/foreign-install)
