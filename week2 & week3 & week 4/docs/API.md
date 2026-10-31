# Lantern Row Books — API Documentation

> Generated from the `Backend/` source code. Only endpoints that actually exist are
> documented here. Anything I could not confirm from the code is marked **TODO: verify**.

## Overview

- **Base URL:** `http://localhost:3000/api/v1`
- **Protocol:** HTTP / JSON (Express 5)
- **CORS:** allow-listed to `http://localhost:5173` (`FRONTEND_URL`), with `credentials: true`
- **Port:** `3000` (`PORT` in `Backend/.env`)

### Authentication

Authentication is **token-based but custom**:

1. `POST /users/register` and `POST /users/login` sign a JWT
   (`jsonwebtoken`, `expiresIn: '2h'`, payload `{ id: String(user.id) }`) and **set it as an
   `httpOnly` cookie** named `token` (`SameSite=Lax`, `Max-Age=3600`, `Path=/`).
   The token is **not** returned in the response body.
2. The token value is also written to the `users.session_token` column.
3. `GET /users/me` and `POST /users/logout` read the token from the **`token` cookie**
   (via `cookie-parser`), falling back to the **`Authorization: Bearer <token>` header**
   when no cookie is present.
4. Endpoints behind `middleware/authentication.js` (everything under `/purchases`) read
   the token **only from the `token` cookie**, call `jwt.verify` with `JWT_SECRET`, and
   then confirm the token still exists in `users.session_token`.

There are two validation styles in the codebase:

- `/users/me` and `/users/logout` never call `jwt.verify`; they treat the token as an
  opaque session token validated purely by a database lookup
  (`SELECT … WHERE session_token = $1`), so signature and `2h` expiry are **not** enforced.
- `/purchases/*` verifies the JWT signature/expiry **and** checks the database, and makes
  `req.user.id` available as `decoded.id` (a string).

### Common headers

| Header             | Value              | Notes                                                                                              |
| ------------------ | ------------------ | -------------------------------------------------------------------------------------------------- |
| `Content-Type`     | `application/json` | Required on all POST bodies                                                                        |
| `Authorization`    | `Bearer <token>`   | Fallback for `/users/me` and `/users/logout` (when no cookie); **not** read by `/purchases/*`      |
| `stripe-signature` | `<signature>`      | Webhook only (`POST /payments/webhook`)                                                            |

### Standard response format

**Success** — shape varies by endpoint; `message` is present on some endpoints only:

```json
{ "data": "<payload>", "message": "<optional>" }
```

**Error** — identical for all endpoints (from `middleware/errorHandler.js`):

```json
{ "status": 401, "message": "..." }
```

- `status` is the numeric HTTP status code.
- `message` is `"Server error"` for any `5xx`, otherwise the thrown error message.

> Exception: the Stripe webhook (`POST /payments/webhook`) replies with
> `{ "message": "..." }` only (see [Payments](#payments-stripe-webhook)).

---

## Users

Base path: `/users`

### Register

`POST /users/register`

Create a user and start a session.

- **Auth required:** no

| Field      | Type   | Required | Notes                                                |
| ---------- | ------ | -------- | ---------------------------------------------------- |
| `username` | string | yes      | `VARCHAR(255) NOT NULL UNIQUE`                        |
| `password` | string | yes      | `VARCHAR(255) NOT NULL`; hashed with bcrypt (cost 12) |

**Example request**

```bash
curl -i -X POST http://localhost:3000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"ada","password":"secret"}'
```

**Example success response — `201 Created`**

```json
{
  "data": "ada",
  "message": "User successfully created"
}
```

> ⚠️ `data` is the username **string** here, unlike login which returns an object.
> TODO: verify intended shape.

Also sets `Set-Cookie: token=<jwt>; HttpOnly; SameSite=Lax; Max-Age=3600; Path=/`.

**Error responses**

| Status | Body                                        | When                                                          |
| ------ | ------------------------------------------- | ------------------------------------------------------------- |
| `500`  | `{"status":500,"message":"Server error"}`   | duplicate username (unique violation), missing/`undefined` password, DB error |

> TODO: verify — a duplicate username should be `409` and a missing password `400`/`422`;
> the current code returns `500` because these are unhandled Postgres/bcrypt errors.

---

### Login

`POST /users/login`

Authenticate an existing user and start a session.

- **Auth required:** no

| Field      | Type   | Required | Notes |
| ---------- | ------ | -------- | ----- |
| `username` | string | yes      |       |
| `password` | string | yes      | compared with bcrypt |

**Example request**

```bash
curl -i -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ada","password":"secret"}'
```

**Example success response — `200 OK`**

```json
{
  "data": { "id": 1, "username": "ada" },
  "message": "login success"
}
```

Also sets `Set-Cookie: token=<jwt>; HttpOnly; SameSite=Lax; Max-Age=3600; Path=/`.

**Error responses**

| Status | Body                                                  | When                              |
| ------ | ----------------------------------------------------- | --------------------------------- |
| `401`  | `{"status":401,"message":"Username or password wrong"}` | unknown username or wrong password |

---

### Logout

`POST /users/logout`

End the current session (clears `session_token` in the DB).

- **Auth required:** yes — session `token` cookie (or `Authorization: Bearer <token>` header)

| Field      | Type   | Required | Notes                                        |
| ---------- | ------ | -------- | -------------------------------------------- |
| `username` | string | yes      | body; must match the token's owner           |

**Example request**

```bash
curl -i -X POST http://localhost:3000/api/v1/users/logout \
  -H "Content-Type: application/json" \
  -b "token=<jwt>" \
  -d '{"username":"ada"}'
```

**Example success response — `200 OK`**

```json
{ "message": "logout success" }
```

**Error responses**

| Status | Body                                   | When                                                |
| ------ | -------------------------------------- | --------------------------------------------------- |
| `401`  | `{"status":401,"message":"Invalid"}`   | `username` does not match the token's owner          |
| `500`  | `{"status":500,"message":"Server error"}` | unknown/expired token (lookup returns `null`)     |

> Logout also clears the `token` cookie (`Set-Cookie: token=; Expires=…`) and nulls the DB row.

---

### Current user (me)

`GET /users/me`

Return the user identified by the session token.

- **Auth required:** yes — session `token` cookie (or `Authorization: Bearer <token>` header)
- **Params / query / body:** none

**Example request**

```bash
curl -i http://localhost:3000/api/v1/users/me \
  -b "token=<jwt>"
```

**Example success response — `200 OK`**

```json
{ "data": { "id": 1, "username": "ada" } }
```

**Error responses**

| Status | Body                                       | When                                   |
| ------ | ------------------------------------------ | -------------------------------------- |
| `401`  | `{"status":401,"message":"user not found"}` | token not present / not found in DB    |

---

## Books

Base path: `/book` (note: singular)

### List books by category

`GET /book`

Return all books in a category.

- **Auth required:** no

| Query      | Type   | Required | Notes                                                        |
| ---------- | ------ | -------- | ------------------------------------------------------------ |
| `category` | string | yes      | one of `fiction`, `nonfiction`, `staff_picks`                 |

**Example request**

```bash
curl "http://localhost:3000/api/v1/book?category=fiction"
```

**Example success response — `200 OK`**

```json
{
  "data": [
    {
      "id": "1",
      "title": "The Salt Orchard",
      "author": "Mara Ellison",
      "category": "fiction",
      "image": "image/c01-salt-orchard.webp",
      "alt": "Cover of The Salt Orchard by Mara Ellison: …",
      "price": "18.00",
      "button_text": "Add to bag",
      "created_at": "2026-10-25T00:00:00.000Z",
      "shelf": "Shelf F1"
    }
  ]
}
```

| Field         | Type           | Notes                                                             |
| ------------- | -------------- | ----------------------------------------------------------------- |
| `id`          | string         | `BIGINT` identity PK — `pg` returns it as a string (e.g. `"1"`)    |
| `title`       | string         |                                                                   |
| `author`      | string         |                                                                   |
| `category`    | string         | `fiction` \| `nonfiction` \| `staff_picks`                         |
| `image`       | string         | relative image path                                                |
| `alt`         | string         |                                                                   |
| `price`       | string         | `NUMERIC(10,2)` — returned as a string by `pg` (e.g. `"18.00"`) |
| `button_text` | string         | default `"Add to bag"`                                             |
| `created_at`  | string         | timestamptz                                                       |
| `shelf`       | string \| null | physical shelf label (e.g. `"Shelf F1"`), added by the `add-shelf-to-books` migration |

**Error responses**

| Status | Body                                                | When                          |
| ------ | --------------------------------------------------- | ----------------------------- |
| `401`  | `{"status":401,"message":"Category query is required"}` | missing or invalid `category` |

> TODO: verify — this returns `401` but a validation error is conventionally `400`.

---

## Events

Base path: `/event` (note: singular)

### List events

`GET /event`

Return events, either all of them or filtered by category.

- **Auth required:** no

| Query      | Type   | Required | Notes                                                                 |
| ---------- | ------ | -------- | ---------------------------------------------------------------------- |
| `category` | string | yes      | `all` for everything; `Book club` or `Event` otherwise (case of the first letter is normalized) |

**Example request**

```bash
curl "http://localhost:3000/api/v1/event?category=all"
```

**Example success response — `200 OK`**

```json
{
  "data": [
    {
      "id": "1",
      "title": "An evening with Mara Ellison",
      "month": "Oct",
      "day": 24,
      "weekday": "Thursday",
      "time": "7:00 pm",
      "category": "Event",
      "description": "Mara reads from The Salt Orchard …",
      "button_text": "Save a seat"
    }
  ]
}
```

| Field         | Type   | Notes                    |
| ------------- | ------ | ------------------------ |
| `id`          | string | `BIGINT` identity PK — `pg` returns it as a string (e.g. `"1"`) |
| `title`       | string |                          |
| `month`       | string |                          |
| `day`         | number | `INT`                    |
| `weekday`     | string |                          |
| `time`        | string |                          |
| `category`    | string | `Event` \| `Book club`    |
| `description` | string |                          |
| `button_text` | string |                          |

**Error responses**

| Status | Body                                              | When                      |
| ------ | ------------------------------------------------- | ------------------------- |
| `400`  | `{"status":400,"message":"Category not found"}`   | category is not `all`/`Book club`/`Event` |
| `500`  | `{"status":500,"message":"Server error"}`         | `category` omitted (`.charAt` on `undefined`) |

> TODO: verify — omitting `category` throws instead of returning `400`.

---

## Purchases

Base path: `/purchases`

Book purchases go through **Stripe Checkout**. The frontend calls `POST /purchases/checkout`,
redirects the browser to the returned `checkoutUrl`, and Stripe later calls the webhook to
mark the purchase as paid. Ownership is read with `GET /purchases/my-purchases`.

### Purchase states

| Status    | Meaning                                                         |
| --------- | --------------------------------------------------------------- |
| `pending` | Row created, Stripe Checkout Session opened, payment not settled |
| `paid`    | Stripe reported `checkout.session.completed` with `payment_status: "paid"` |
| `failed`  | Stripe Session creation failed and the row was rolled back to `failed` |

### Checkout

`POST /purchases/checkout`

Create a pending purchase and a Stripe Checkout Session for one book.

- **Auth required:** yes — `token` cookie (verified JWT + DB session lookup)

| Field    | Type           | Required | Notes                          |
| -------- | -------------- | -------- | ------------------------------ |
| `bookId` | number/string  | yes      | `books.id` (BIGINT)            |

**Example request**

```bash
curl -i -X POST http://localhost:3000/api/v1/purchases/checkout \
  -H "Content-Type: application/json" \
  -b "token=<jwt>" \
  -d '{"bookId": 1}'
```

**Example success response — `201 Created`**

```json
{ "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_a1..." }
```

**What happens server-side**

1. Load the book (`404` if it does not exist).
2. Reject with `409` if a **paid** purchase already exists for `(user, book)`.
   A `pending`/`failed` row does **not** block a new checkout.
3. Insert a `pending` purchase with `amount` equal to the book's current price.
4. Create a Stripe Checkout Session (`mode: payment`, `currency: usd`,
   `unit_amount = round(price * 100)`, quantity 1) with metadata
   `purchase_id` and `user_id`.
5. Save `stripe_checkout_session_id` on the purchase row.
6. Return the Session URL.

`success_url` and `cancel_url` point at `${FRONTEND_URL}/?payment=success` and
`${FRONTEND_URL}/?payment=cancelled` respectively. If Stripe Session creation throws,
the purchase row is set to `failed` before the error is rethrown.

**Error responses**

| Status | Body                                                    | When                              |
| ------ | ------------------------------------------------------- | --------------------------------- |
| `401`  | `{"status":401,"message":"You need to be aunthenticated"}` | missing/invalid cookie token   |
| `404`  | `{"status":404,"message":"Book not found"}`             | `bookId` does not match a book    |
| `409`  | `{"status":409,"message":"You already own this book"}`  | a paid purchase already exists    |
| `500`  | `{"status":500,"message":"Server error"}`               | Stripe or database failure        |

---

### List owned books

`GET /purchases/my-purchases`

Return the IDs of books the current user has **paid for**.

- **Auth required:** yes — `token` cookie (verified JWT + DB session lookup)
- **Params / query / body:** none

**Example request**

```bash
curl -i http://localhost:3000/api/v1/purchases/my-purchases -b "token=<jwt>"
```

**Example success response — `200 OK`**

```json
{ "data": ["1", "4"] }
```

`data` is an array of `book_id` values **as strings** (only rows with `status = 'paid'`),
and `[]` when the user owns nothing.

**Error responses**

| Status | Body                                                        | When                |
| ------ | ----------------------------------------------------------- | ------------------- |
| `401`  | `{"status":401,"message":"You need to be aunthenticated"}`   | missing/invalid token |

---

## Payments (Stripe webhook)

### Stripe webhook

`POST /api/v1/payments/webhook`

> Note the **different base path** — this route is mounted on the app directly, not under
> `/purchases`, and it is registered **before** `express.json()` so it receives the raw
> body Stripe signs.

Receives Stripe events and marks the matching purchase as paid.

- **Auth required:** no session — authenticity comes from the `stripe-signature` header,
  verified with `STRIPE_WEBHOOK`
- **Body:** raw JSON bytes exactly as Stripe sends them (the route bypasses `express.json()`
  so the signature check sees the original payload)

**Handled event**

| Event                        | Action                                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `checkout.session.completed` | If `metadata.purchase_id` exists and `payment_status === "paid"`, set the purchase to `paid`, `paid_at = NOW()` — only when the row is still `pending` and `stripe_checkout_session_id` matches the Session |

All other event types, unpaid sessions, and purchases that no longer match are acknowledged
with `200` and no change.

**Example success response — `200 OK`**

```json
{ "received": true }
```

**Error responses**

| Status | Body                                              | When                                        |
| ------ | ------------------------------------------------- | ------------------------------------------- |
| `400`  | `{"message":"Invalid signature"}`                 | signature header missing or does not verify |
| `400`  | `{"message":"Missing purchases metadata"}`        | Session has no `metadata.purchase_id`       |
| `500`  | `{"message":"Webhook processing failed"}`         | unexpected error while updating the purchase|

Local development (Stripe CLI):

```bash
stripe listen --forward-to localhost:3000/api/v1/payments/webhook
# copy the printed whsec_... into STRIPE_WEBHOOK in Backend/.env
```

---

## Data models (reference)

**users**

| Column         | Type        | Notes                                  |
| -------------- | ----------- | -------------------------------------- |
| `id`           | integer     | identity PK                            |
| `username`     | varchar(255)| NOT NULL, UNIQUE                        |
| `password`     | varchar(255)| NOT NULL (bcrypt hash)                  |
| `session_token`| text        | UNIQUE, nullable                        |
| `created_at`   | timestamptz | default NOW()                          |
| `updated_at`   | timestamptz | default NOW()                          |

**books** — `id`, `title`, `author`, `category` (CHECK in `fiction`/`nonfiction`/`staff_picks`),
`image`, `alt`, `price` (CHECK `>= 0`), `button_text` (default `'Add to bag'`),
`created_at`, `shelf` (VARCHAR(50), nullable, added by `add-shelf-to-books`);
UNIQUE `(title, author)`.

**events** — `id`, `title`, `month`, `day` (INT), `weekday`, `time`, `category`,
`description`, `button_text`.

**purchases**

| Column                       | Type           | Notes                                                         |
| ---------------------------- | -------------- | ------------------------------------------------------------- |
| `id`                         | bigint         | identity PK                                                   |
| `user_id`                    | bigint         | FK → `users.id`, NOT NULL                                     |
| `book_id`                    | bigint         | FK → `books.id`, NOT NULL                                     |
| `status`                     | varchar(20)    | `pending` (default) \| `paid` \| `failed`                      |
| `amount`                     | numeric(10,2)  | price copied at checkout time                                 |
| `stripe_checkout_session_id` | text           | UNIQUE, nullable                                              |
| `created_at`                 | timestamptz    | default `NOW()`                                               |
| `paid_at`                    | timestamptz    | nullable                                                      |

Indexes / constraints:

- The original `UNIQUE (user_id, book_id)` was **dropped** by the
  `fix-purchases-unique` migration.
- A **partial unique index** `unique_paid_purchase ON purchases (user_id, book_id)
  WHERE status = 'paid'` is what actually prevents owning the same book twice — a user may
  have several `pending`/`failed` rows for the same book.
