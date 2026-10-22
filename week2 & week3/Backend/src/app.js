const express = require('express')
const userRoutes = require('./routes/user')
const requestLogger = require('./middleware/requestLogger')
const errorLogger = require('./middleware/errorHandler.js')

const app = express()
app.use(express.json())
app.use(requestLogger)

app.use('/users', userRoutes)

app.use(errorLogger)

module.exports = app
