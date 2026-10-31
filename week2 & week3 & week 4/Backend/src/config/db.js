const env = require('./config')

const { Pool } = require('pg')

const pool = new Pool({
  host: env.host,
  port: env.port,
  database: env.database,
  user: env.user,
  password: env.password,
})

module.exports = pool
