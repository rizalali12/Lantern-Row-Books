CREATE TABLE purchases (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
user_id BIGINT NOT NULL REFERENCES users(id),
book_id BIGINT NOT NULL REFERENCES books(id),
status VARCHAR(20) NOT NULL DEFAULT 'pending'
  CHECK(status IN ('pending', 'paid', 'failed')),
amount NUMERIC(10,2) NOT NULL,
    stripe_checkout_session_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    UNIQUE (user_id, book_id)
);
