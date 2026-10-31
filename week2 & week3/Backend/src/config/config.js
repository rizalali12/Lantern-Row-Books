require('dotenv').config()

module.exports = {
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  serverPort: process.env.PORT,
  frontendUrl: process.env.FRONTEND_URL,
  stripeSecret: process.env.STRIPE_SECRET_KEY,
  stripeWebhook: process.env.STRIPE_WEBHOOK
}
