-- Up Migration

ALTER TABLE purchases
DROP CONSTRAINT IF EXISTS purchases_user_id_book_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS unique_paid_purchase
ON purchases (user_id, book_id)
WHERE status = 'paid';
