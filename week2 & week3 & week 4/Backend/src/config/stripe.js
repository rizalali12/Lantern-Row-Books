const Stripe = require('stripe')
const env = require('./config')

const stripe = new Stripe(env.stripeSecret)

const createStripeSession = async (bookTitle, price, purchasesId, userId) => {

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Book: ${bookTitle}`
        },
        unit_amount: Math.round(Number(price) * 100)
      },
      quantity: 1
    }],
    metadata: {
      purchase_id: String(purchasesId),
      user_id: String(userId)
    },
    success_url: `${env.frontendUrl}/?payment=success`,
    cancel_url: `${env.frontendUrl}/?payment=cancelled`
  })

  return session
}


const webhook = (body, signature) => {
  const result = stripe.webhooks.constructEvent(body, signature, env.stripeWebhook)

  return result
}

module.exports = { stripe, createStripeSession, webhook }
