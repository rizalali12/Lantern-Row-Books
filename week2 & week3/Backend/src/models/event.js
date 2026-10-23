const pool = require('../config/db')


const getAllEvent = async () => {
  const result = await pool.query(
    'SELECT * FROM events'
  )

  return result.rows
}

const getCategoryEvent = async (category) => {
  const result = await pool.query(
    'SELECT * FROM events WHERE category = $1', [category]
  )

  return result.rows
}

module.exports = { getAllEvent, getCategoryEvent }
