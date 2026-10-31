const response = (res, statusCode, message = null, data = null) => {
  res.status(statusCode).json({
    data,
    ...(message !== null ? { message } : {})
  })
}


module.exports = response
