const pool = require('../config/db')

const getByCategory = async (category) => {
  const result = await pool.query(
    'SELECT * FROM books WHERE category = $1', [category]
  )

  return result.rows
}


module.exports = { getByCategory }
