const express = require('express')
const router = express.Router()
const eventController = require('../controller/event')

router.get('/', eventController.getEventData)

module.exports = router
