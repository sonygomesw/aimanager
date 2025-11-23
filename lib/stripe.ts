import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

export const PLANS = {
  PRO: {
    name: 'PRO',
    monthly: {
      price: 29,
      priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    },
    annual: {
      price: 290,
      priceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID!,
    },
  },
  PREMIUM: {
    name: 'PREMIUM',
    monthly: {
      price: 59,
      priceId: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
    },
    annual: {
      price: 590,
      priceId: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID!,
    },
  },
  ELITE: {
    name: 'ELITE',
    monthly: {
      price: 99,
      priceId: process.env.STRIPE_ELITE_MONTHLY_PRICE_ID!,
    },
    annual: {
      price: 990,
      priceId: process.env.STRIPE_ELITE_ANNUAL_PRICE_ID!,
    },
  },
}
