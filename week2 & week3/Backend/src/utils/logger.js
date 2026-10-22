const logger = {
  info: (message, metadata = {}) => {
    console.log(JSON.stringify({
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      ...metadata,
    }))
  },
  warn: (message, metadata = {}) => {
    console.log(JSON.stringify({
      level: 'warn',
      timestamp: new Date().toISOString(),
      message,
      ...metadata,
    }))
  },
  error: (message, metadata = {}) => {
    console.error(JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      ...metadata,
    }))
  },
}

module.exports = logger
