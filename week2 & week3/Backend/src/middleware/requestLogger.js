const logger = require('../utils/logger')

const requestLogger = (req, res, next) => {
  res.on("finish", () => {
    logger.info('HTTP Request', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode
    })
  })


  next()
}

module.exports = requestLogger
