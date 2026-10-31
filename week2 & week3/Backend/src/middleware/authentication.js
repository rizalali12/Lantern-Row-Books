const jwt = require('jsonwebtoken')
const userModels = require('../models/users')

const authentication = async (req, res, next) => {
  try {
    const token = req.cookies?.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const isValid = await userModels.findByToken(token)
    if (!isValid) return res.status(401).json({ message: "You need to be aunthenticated" })

    req.user = {
      id: decoded.id
    }

    next()
  } catch (error) {
    return res.status(401).json({ message: "You need to be aunthenticated" })

  }
}


module.exports = authentication
