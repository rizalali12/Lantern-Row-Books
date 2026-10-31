const purchasesModels = require('../models/purchases')
const stripe = require('../config/stripe')


const checkout = async (userId, bookId) => {
  let purchaseId

  try {
    const bookResult = await purchasesModels.getBookResult(bookId)

    if (!bookResult) {
      const error = new Error('Book not found')
      error.statusCode = 404
      throw error
    }

    const existingPurchases =
      await purchasesModels.getExistingPurchase(userId, bookId)

    if (existingPurchases) {
      const error = new Error('You already own this book')
      error.statusCode = 409
      throw error
    }

    const purchaseResult =
      await purchasesModels.insertPurchaseResult(
        userId,
        bookId,
        bookResult.price
      )

    purchaseId = purchaseResult.id

    const stripeSession = await stripe.createStripeSession(
      bookResult.title,
      bookResult.price,
      purchaseId,
      userId
    )

    await purchasesModels.updatePurchases(
      stripeSession.id,
      purchaseId
    )

    return stripeSession.url

  } catch (error) {
    if (purchaseId) {
      await purchasesModels.failPurchases(purchaseId)
    }

    throw error
  }
}



const paymentWebhook = async (signature, body) => {
  let event

  try {
    event = stripe.webhook(body, signature)
  } catch (error) {
    console.log(error)
    return 'invalid signature'
  }
  try {
    if (event.type !== 'checkout.session.completed') {
      return 'ignored'
    }

    const session = event.data.object
    const purchasesId = session.metadata?.purchase_id

    if (!purchasesId) {
      return 'missing metadata'
    }

    if (session.payment_status !== 'paid') {
      return 'unpaid'
    }

    const updatedRows = await purchasesModels.updatePayment(purchasesId, session.id)

    if (!updatedRows) {
      return 'not updated'
    }

    return 'paid'
  } catch (error) {
    console.log(error)
    return 'error'
  }
}

const getPurchasesBooks = async (userId) => {
  try {
    const result = await purchasesModels.getPurchaseBooks(userId)

    return result.map((item) => String(item.book_id))

  } catch (error) {
    console.log(error)
  }
}


module.exports = { checkout, paymentWebhook, getPurchasesBooks }
