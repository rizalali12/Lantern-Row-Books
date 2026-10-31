const express = require('express')
const router = express.Router()

const userController = require('../controller/user')

router.get('/me', userController.getUser)
router.post('/register', userController.addUsers)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

module.exports = router
