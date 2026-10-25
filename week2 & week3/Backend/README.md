# Lantern Row Books - Backend

Express 5 REST API backed by PostgreSQL.

## Prerequisites

- Node.js 20 or newer
- PostgreSQL running locally

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your environment file:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your database credentials and a random `JWT_SECRET`
   (for example `openssl rand -hex 32`).

3. Create the database and apply the migrations:

   ```bash
   createdb lanternbooks
   DATABASE_URL="postgres://USER:PASSWORD@localhost:5432/lanternbooks" npx node-pg-migrate up -j sql
   ```

   Replace `USER` and `PASSWORD` with your PostgreSQL credentials.

4. Start the server:

   ```bash
   node src/server.js
   ```

   The API is served at `http://localhost:3000`.

## Environment variables

Copy `.env.example` to `.env` and fill in the values.

| Variable       | Description                        |
| -------------- | ---------------------------------- |
| `PGHOST`       | PostgreSQL host                    |
| `PGPORT`       | PostgreSQL port                    |
| `PGDATABASE`   | Database name                      |
| `PGUSER`       | Database user                      |
| `PGPASSWORD`   | Database password                  |
| `PORT`         | Port the API listens on            |
| `FRONTEND_URL` | Allowed CORS origin                |
| `JWT_SECRET`   | Secret used to sign session tokens |

The server loads the `PG*` variables through `dotenv`. The migration tool
(`node-pg-migrate`) reads a full `DATABASE_URL` connection string instead,
which is why the migrate commands pass it inline.

## Migrations

Migration files are plain SQL in `migrations/`.

```bash
# create a new migration
npx node-pg-migrate create <name> -j sql

# apply pending migrations
DATABASE_URL="postgres://USER:PASSWORD@localhost:5432/lanternbooks" npx node-pg-migrate up -j sql

# roll back the last migration
DATABASE_URL="postgres://USER:PASSWORD@localhost:5432/lanternbooks" npx node-pg-migrate down -j sql
```

## API documentation

See [docs/API.md](../docs/API.md).
