# Neon Database Setup

The PostgreSQL schema is defined with Drizzle in `db/schema/`. The Expo app is a client, so do not put a Neon connection string in client-side code or an `EXPO_PUBLIC_` variable. Connect to Neon from a trusted server/API only.

## Configure credentials

1. Copy `.env.example` to `.env` in the project root.
2. Set `DATABASE_URL` to the pooled connection string from the Neon console. Keep `.env` out of version control.

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
```

The Drizzle config also accepts `NEON_DATABASE_URL`.

## Install and create the schema

```bash
corepack pnpm install
corepack pnpm db:generate
```

`db:generate` creates SQL migrations in `drizzle/` from the local schema and does not need database credentials. Once a Neon database is available, apply the schema with either:

```bash
corepack pnpm db:push
```

For a migration-based workflow instead, generate migrations and apply them with:

```bash
corepack pnpm db:generate
corepack pnpm db:migrate
```

Use `db:push` for local iteration, or commit generated migration files and use `db:migrate` for deployed environments. `db:studio` opens Drizzle Studio and requires `DATABASE_URL`.

## Automatic development sync

Run the watcher against a development Neon branch:

```bash
corepack pnpm db:watch
```

It pushes the current schema once at startup, then watches TypeScript files in `db/schema/` and pushes after edits settle. Leave this process running while developing. It does not use Drizzle's `--force` option, so potentially destructive changes still require confirmation. Do not point the watcher at production; use committed migrations and `db:migrate` in your production deployment workflow.

## Tables

- `users`: user profile records
- `reading_progress`: current Quran position
- `bookmarks`, `notes`, `highlights`: saved reading content
- `salah_records`, `fasting_days`, `tasbeeh_history`: worship activity tracking
- `favorite_duas`, `asma_favorites`, `name_favorites`: saved references
- `ai_conversations`: conversation history

The connection helper is `db/index.ts`. Use it only from a trusted server environment; do not import it into Expo screens or bundle Neon credentials in the app. The client currently remains local/offline and is not wired to a backend API.
