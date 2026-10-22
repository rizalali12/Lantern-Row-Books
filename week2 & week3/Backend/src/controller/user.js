const userService = require('../services/user')
const response = require('../middleware/responseHandler')

const getUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    const users = await userService.getUserData(token)

    response(res, 200, null, users)
  } catch (error) {
    next(error)
  }
}

const addUsers = async (req, res, next) => {
  try {
    const { username, password } = req.body

    const user = await userService.addUser(username, password)

    res.cookie('token', user.token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/'
    })

    res.status(201).json({ data: user.user, message: "User successfully created" })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await userService.login(username, password)

    res.cookie('token', user.token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/'
    })

    res.status(200).json({
      data: user.user,
      message: "login success"
    })
  } catch (error) {
    next(error)
  }
}


const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const { username } = req.body

    await userService.logout(username, token)

    res.status(200).json({
      message: "logout success"
    })
  } catch (error) {
    next(error)
  }
}


module.exports = {
  getUser, addUsers, login, logout
}
