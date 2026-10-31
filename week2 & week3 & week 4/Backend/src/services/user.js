
const userModel = require('../models/users')
const bcrypt = require('bcrypt')
const generateToken = require('../utils/generateToken')
const AppError = require('../utils/error')

const getUserData = async (token) => {
  const user = await userModel.findByToken(token)

  if (!user) {
    throw new AppError('user not found', 401)
  }

  return user
}

const addUser = async (username, password) => {
  const hashPassword = await bcrypt.hash(password, 12)

  await userModel.createUser(username, hashPassword)

  const user = await userModel.findByUsername(username)

  const token = generateToken(user.id)

  await userModel.insertToken(token, user.username)

  return { token, user: user.username }
}


const login = async (username, password) => {
  const user = await userModel.findByUsername(username)

  if (!user) {
    throw new AppError("Username or password wrong", 401)
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) throw new AppError("Username or password wrong", 401)

  const token = generateToken(user.id)

  await userModel.insertToken(token, user.username)

  return {
    token, user: {
      id: user.id,
      username: user.username,
    },
  }
}

const logout = async (username, token) => {
  const user = await userModel.findByToken(token)

  if (user.username !== username) throw new AppError("Invalid", 401)

  await userModel.removeSessionToken(token, username)

  return null
}


module.exports = { getUserData, addUser, login, logout }
