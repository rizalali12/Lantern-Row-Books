# Lantern Row Books - Backend

Express 5 REST API backed by PostgreSQL.

## Prerequisites

- Node.js 20 or newer
- PostgreSQL running locally
- A Stripe account (test mode) and the [Stripe CLI](https://stripe.com/docs/stripe-cli)
  for local webhook forwarding (see [Payments](#payments-stripe))

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

| Variable            | Description                                                          |
| ------------------- | -------------------------------------------------------------------- |
| `PGHOST`            | PostgreSQL host                                                      |
| `PGPORT`            | PostgreSQL port                                                      |
| `PGDATABASE`        | Database name                                                        |
| `PGUSER`            | Database user                                                        |
| `PGPASSWORD`        | Database password                                                    |
| `PORT`              | Port the API listens on                                              |
| `FRONTEND_URL`      | Allowed CORS origin; also used for Stripe success/cancel redirects   |
| `JWT_SECRET`        | Secret used to sign session tokens                                   |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_…` in development)                       |
| `STRIPE_WEBHOOK`    | Webhook signing secret (`whsec_…`) used to verify `stripe-signature` |

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

## Payments (Stripe)

Book purchases use **Stripe Checkout**. The flow is:

1. `POST /api/v1/purchases/checkout` (authenticated) creates a `pending` purchase row and
   a Stripe Checkout Session, then returns `{ "checkoutUrl": "…" }`.
2. The frontend redirects the browser to that URL.
3. Stripe calls `POST /api/v1/payments/webhook`; on
   `checkout.session.completed` with `payment_status: "paid"` the purchase becomes `paid`.
4. `GET /api/v1/purchases/my-purchases` returns the `book_id`s the user owns.

### Configuration

Add both Stripe variables to `.env`:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK=whsec_...
```

`FRONTEND_URL` is used for the Checkout `success_url` / `cancel_url`
(`${FRONTEND_URL}/?payment=success` and `${FRONTEND_URL}/?payment=cancelled`).

### Local webhooks

Stripe cannot reach `localhost`, so forward events with the CLI:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/v1/payments/webhook
```

The CLI prints a `whsec_…` secret — put it in `STRIPE_WEBHOOK` and restart the server.
Without this, checkouts still redirect correctly but purchases stay `pending` forever,
because only the webhook marks them `paid`.

To exercise the full flow, use the test card `4242 4242 4242 4242`, any future expiry, and
any CVC. The webhook route must keep its raw-body handler: it is registered before
`express.json()` in `src/app.js` so `stripe.webhooks.constructEvent` receives the exact
bytes Stripe signed.

## API documentation

See [docs/API.md](../docs/API.md).
