import { Model } from 'backbone'
import _ from 'underscore'
import { LocalStorage } from 'backbone.localstorage'
import { getLocalStorage } from 'backbone.localstorage/src/utils'

class ShoppingCart extends Model {
  get defaults() {
    return {
      monthly: {
        amount: 0,
        quantity: 0,
        total: 0,
      },
      annual: {
        amount: 0,
        quantity: 0,
        total: 0,
      },
    }
  }

  initialize() {
    console.log('ShoppingCart initialize')
    console.log(this)
    this.localStorage = new LocalStorage(this.get('localStorageID'))
    // console.log(this.localStorage)
    const store = getLocalStorage(this)
    console.log(store)
    // if (_.isEmpty(store.records)) {
    //   this.set({
    //     something
    //   })
    // }

    this.on('cart:promoCodeApplied', (value, options) => {
      console.log(value, options)
      // debugger
      // this.unset('promoCodeApplied', { silent: true })
      if (value) {
        this.applyPromoPricing(value, options)
      } else {
        this.removePromoPricing(value, options)
      }
    })

    // this.on('change:monthly', (model, value, options) => {
    //   console.log(model, value, options)
    //   const { context } = options
    //   const isPromoAvailable = context.model.has('membershipPromo')
    //   if (value && isPromoAvailable) {
    //     const term = Number(context.model.get('membershipPromo').MembershipTerm)
    //     const termType = context.model.get('membershipPromo').MembershipTermType
    //     const isMonthlyPromo = (isPromoAvailable && term === 1 && termType === 'MONTH')
    //     debugger
    //     if (isMonthlyPromo) {
    //       console.log('apply monthly promotion')
    //       // const percentageOff = context.model.get('membershipPromo').StripePercentOff
    //     }
    //   } else {
    //     console.log('NO monthly promotion')
    //   }
    // })

    // this.on('change:annual', (model, value, options) => {
    //   console.log(model, value, options)
    //   const { context } = options
    //   const isPromoAvailable = context.model.has('membershipPromo')
    //   if (value && isPromoAvailable) {
    //     const term = Number(context.model.get('membershipPromo').MembershipTerm)
    //     const termType = context.model.get('membershipPromo').MembershipTermType
    //     const isMonthlyPromo = (isPromoAvailable && term === 12 && termType === 'MONTH')
    //     debugger
    //     if (value && isMonthlyPromo) {
    //       console.log('apply annual promotion')
    //       // const percentageOff = context.model.get('membershipPromo').StripePercentOff
    //     }
    //   } else {
    //     console.log('NO annual promotion')
    //   }
    // })

    this.on('change:gift', (model, value, options) => {
      console.log(model, value, options)
      const { context } = options
      const isDiscountRate = context.model.has('DiscountRate')
      // debugger
      if (value && isDiscountRate) {
        console.log('apply discountRate gifting')
        const quantity = parseInt(value.quantity, 10)
        const giftItem = context.model.get('DiscountRate').find(({ count }) => count === quantity)
        const amount = parseFloat(giftItem.Amount)
        const total = parseFloat((quantity * amount).toFixed(2))
        const gift = {
          quantity,
          amount,
          total,
        }
        this.set(gift, { silent: true })
      }
    })
  }

  updateDefaultAnnual(annualStripePlan) {
    const defaultAnnual = {
      annual: {
        quantity: 0,
        amount: annualStripePlan.SubscriptionAmount,
        total: 0,
      },
    }
    // debugger
    this.set(defaultAnnual, { silent: true })
  }

  updateDefaultMonthly(monthlyStripePlan) {
    const defaultMonthly = {
      monthly: {
        quantity: 0,
        amount: monthlyStripePlan.SubscriptionAmount,
        total: 0,
      },
    }
    // debugger
    this.set(defaultMonthly, { silent: true })
  }

  applyPromoPricing(value, options) {
    console.log('ShoppingCart applyPromoPricing')
    console.log(value, options)
    const { context } = options
    // debugger
    let type = 'monthly'
    const {
      // PromotionCode,
      // Name,
      // StripeDuration,
      // StripeDurationInMonths,
      // StripeOrg,
      MembershipTerm,
      MembershipTermType,
      StripePercentOff,
    } = value

    if (MembershipTermType === 'MONTH') {
      if (MembershipTerm === '1') {
        type = 'monthly'
      }
      if (MembershipTerm === '12') {
        type = 'annual'
      }
    }

    if (context.cart.has(type)) {
      const {
        quantity,
        amount,
        // total,
      } = context.cart.get(type)

      const discountedAmount = amount - (amount * (StripePercentOff / 100))
      const discountedTotal = quantity * discountedAmount
      const discountedMembership = {}

      discountedMembership[type] = {
        quantity,
        amount: parseFloat(discountedAmount.toFixed(2)),
        total: parseFloat(discountedTotal.toFixed(2)),
      }
      context.cart.set(discountedMembership)
    }
  }

  removePromoPricing(value, options) {
    console.log('ShoppingCart removePromoPricing')
    console.log(value, options)
    const { context } = options
    // debugger
    if (context.cart.has('monthly')) {
      const { quantity } = context.cart.get('monthly')
      if (quantity) {
        const amount = context.model.get('monthlyStripePlan').SubscriptionAmount
        const total = parseFloat((quantity * amount).toFixed(2))
        // debugger
        context.cart.set({
          monthly: {
            quantity,
            amount,
            total,
          },
        })
      }
    }
    // debugger
    if (context.cart.has('annual')) {
      const { quantity } = context.cart.get('annual')
      if (quantity) {
        const amount = context.model.get('annualStripePlan').SubscriptionAmount
        const total = parseFloat((quantity * amount).toFixed(2))
        // debugger
        context.cart.set({
          monthly: {
            quantity,
            amount,
            total,
          },
        })
      }
    }
  }

  getItemQuantity(type) {
    const { attributes } = this
    let total = 0
    // debugger
    if (!_.isEmpty(attributes[type])) {
      total = attributes[type].quantity
    }
    return total
  }

  getItemAmount(type) {
    const { attributes } = this
    let total = 0
    // debugger
    if (!_.isEmpty(attributes[type])) {
      total = attributes[type].amount
    }
    return total
  }

  getItemTotalAmount(type) {
    const { attributes } = this
    let total = 0
    // debugger
    if (!_.isEmpty(attributes[type])) {
      total = attributes[type].quantity * attributes[type].amount
    }
    return parseFloat(total.toFixed(2))
  }

  getTotalQuantity() {
    const { attributes } = this
    let total = 0
    _.each(attributes, (value, key, list) => {
      console.log(value, key, list)
      total += parseInt(value.quantity, 10)
    })
    return total
  }

  getTotalAmount() {
    const { attributes } = this
    let total = 0
    _.each(attributes, (value, key, list) => {
      console.log(value, key, list)
      total += value.quantity * value.amount
    })
    return parseFloat(total.toFixed(2))
  }

  emptyCart() {
    this.set({
      monthly: {
        amount: 0,
        quantity: 0,
        total: 0,
      },
      annual: {
        amount: 0,
        quantity: 0,
        total: 0,
      },
    })
  }
}

export default ShoppingCart
