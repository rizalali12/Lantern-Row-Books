const express = require('express')
const router = express.Router()
const authentication = require('../middleware/authentication')
const purchasesController = require('../controller/purchases')

router.post('/checkout', authentication, purchasesController.checkout)
router.get('/my-purchases', authentication, purchasesController.getPurchasesBooks)

module.exports = router
