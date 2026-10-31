const pool = require('../config/db')

const findByToken = async (token) => {
  const result = await pool.query(
    'SELECT id, username FROM users WHERE session_token = $1', [token]
  )

  return result.rows[0] ?? null
}

const insertToken = async (token, username) => {
  await pool.query(
    'UPDATE users SET session_token = $1 WHERE username = $2',
    [token, username])

  return null
}

const removeSessionToken = async (token, username) => {
  await pool.query(
    'UPDATE users SET session_token = NULL WHERE username = $1 AND session_token = $2', [username, token]
  )

  return null
}


const createUser = async (username, password, token) => {
  await pool.query(
    'INSERT INTO users (username, password, session_token) VALUES ($1, $2, $3)', [username, password, token]
  )
  return null
}


const findByUsername = async (username) => {
  const result = await pool.query(
    'SELECT id, username, password FROM users WHERE username = $1', [username]
  )

  return result.rows[0] ?? null

}


module.exports = { findByToken, createUser, findByUsername, insertToken, removeSessionToken }
