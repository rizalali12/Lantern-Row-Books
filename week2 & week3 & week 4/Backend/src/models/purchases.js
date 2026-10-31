const pool = require('../config/db')

const getBookResult = async (bookId) => {
  const result = await pool.query(
    'SELECT id, title, price FROM books WHERE id = $1', [bookId]
  )

  return result.rows[0] ?? null
}

const getExistingPurchase = async (userId, bookId) => {
  const result = await pool.query(
    `SELECT id FROM purchases WHERE user_id = $1 AND book_id = $2 AND status = 'paid' `, [userId, bookId]
  )

  return result.rows[0] ?? null
}

const insertPurchaseResult = async (userId, bookId, bookPrice) => {
  const result = await pool.query(
    'INSERT INTO purchases (user_id, book_id, amount ) VALUES ($1, $2, $3) RETURNING id', [userId, bookId, bookPrice]
  )

  return result.rows[0]
}

const updatePurchases = async (stripeSessionId, purchaseId) => {
  await pool.query(
    'UPDATE purchases SET stripe_checkout_session_id = $1 WHERE id = $2', [stripeSessionId, purchaseId]
  )

  return
}

const failPurchases = async (purchaseId) => {
  await pool.query(
    `UPDATE purchases SET status = 'failed' WHERE id = $1 AND status = 'pending'`, [purchaseId]
  )

  return
}


const updatePayment = async (purchaseId, sessionId) => {
  await pool.query(
    `UPDATE purchases SET status = 'paid', paid_at = NOW() WHERE id = $1 AND stripe_checkout_session_id = $2 AND status = 'pending'`, [purchaseId, sessionId]
  )
}


const getPurchaseBooks = async (userId) => {
  const result = await pool.query(
    `SELECT book_id FROM purchases WHERE user_id = $1 AND status = 'paid'`, [userId]
  )

  return result.rows
}


module.exports = { getBookResult, getExistingPurchase, insertPurchaseResult, updatePurchases, failPurchases, updatePayment, getPurchaseBooks }
