const express = require('express')
const userRoutes = require('./routes/user')
const requestLogger = require('./middleware/requestLogger')
const errorLogger = require('./middleware/errorHandler.js')
const bookRoutes = require('./routes/book')
const eventRoutes = require('./routes/event')
const cors = require('cors')
const env = require('./config/config')
const cookieParser = require('cookie-parser')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(requestLogger)
app.use(cors({
  origin: env.frontendUrl,
  credentials: true
}))

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/book', bookRoutes)
app.use('/api/v1/event', eventRoutes)

app.use(errorLogger)

module.exports = app
