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
   (`jsonwebtoken`, `expiresIn: '2h'`, payload `{ sub: user.id }`) and **set it as an
   `httpOnly` cookie** named `token` (`SameSite=Lax`, `Max-Age=3600`, `Path=/`).
   The token is **not** returned in the response body.
2. The token value is also written to the `users.session_token` column.
3. `GET /users/me` and `POST /users/logout` read the token from the **`token` cookie**
   (via `cookie-parser`), falling back to the **`Authorization: Bearer <token>` header**
   when no cookie is present.

Also note: the JWT is **never verified** with `jwt.verify`. It is used as an opaque
session token validated purely by a database lookup (`SELECT … WHERE session_token = $1`),
so the signature and the `2h` expiry are not enforced.

### Common headers

| Header            | Value             | Notes                                                        |
| ----------------- | ----------------- | ------------------------------------------------------------ |
| `Content-Type`    | `application/json`| Required on all POST bodies                                   |
| `Authorization`   | `Bearer <token>`  | Fallback for `/users/me` and `/users/logout` (when no cookie)             |

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
      "created_at": "2026-10-25T00:00:00.000Z"
    }
  ]
}
```

| Field         | Type   | Notes                                                             |
| ------------- | ------ | ----------------------------------------------------------------- |
| `id`          | string | `BIGINT` identity PK — `pg` returns it as a string (e.g. `"1"`)    |
| `title`       | string |                                                                   |
| `author`      | string |                                                                   |
| `category`    | string | `fiction` \| `nonfiction` \| `staff_picks`                         |
| `image`       | string | relative image path                                                |
| `alt`         | string |                                                                   |
| `price`       | string | `NUMERIC(10,2)` — returned as a string by `pg` (e.g. `"18.00"`) |
| `button_text` | string | default `"Add to bag"`                                             |
| `created_at`  | string | timestamptz                                                       |

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
`image`, `alt`, `price` (CHECK `>= 0`), `button_text` (default `'Add to bag'`), `created_at`;
UNIQUE `(title, author)`.

**events** — `id`, `title`, `month`, `day` (INT), `weekday`, `time`, `category`,
`description`, `button_text`.
