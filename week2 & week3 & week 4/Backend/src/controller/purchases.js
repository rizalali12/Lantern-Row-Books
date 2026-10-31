const purchasesService = require('../services/purchases')

const checkout = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { bookId } = req.body
    const checkOutUrl = await purchasesService.checkout(userId, bookId)

    return res.status(201).json({ checkoutUrl: checkOutUrl })

  } catch (error) {
    next(error)
  }
}


const paymentWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['stripe-signature']
    const payment = await purchasesService.paymentWebhook(signature, req.body)

    if (payment === 'invalid signature') {
      return res.status(400).json({ message: 'Invalid signature' })
    }

    if (payment === 'missing metadata') {
      return res.status(400).json({ message: 'Missing purchases metadata' })
    }

    if (payment === 'error') {
      return res.status(500).json({ message: 'Webhook processing failed' })
    }

    return res.json({ received: true })
  } catch (error) {
    next()
  }
}


const getPurchasesBooks = async (req, res, next) => {
  try {
    const result = await purchasesService.getPurchasesBooks(req.user.id)

    return res.json({
      data: result
    })
  } catch (error) {
    next()
  }
}

module.exports = { checkout, paymentWebhook, getPurchasesBooks }
