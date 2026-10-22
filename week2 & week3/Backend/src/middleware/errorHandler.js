const logger = require('../utils/logger')

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  const statusCode = err.statusCode || 500

  logger.error(err.message, {
    method: req.method,
    path: req.originalUrl,
    statusCode,
  })

  res.status(statusCode).json({
    status: statusCode,
    message: statusCode >= 500 ? "Server error" : err.message
  })
}


module.exports = errorHandler
