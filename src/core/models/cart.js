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

    this.on('cart:promoCodeApplied', (value, type, options) => {
      console.log(value, type, options)
      // debugger
      // this.unset('promoCodeApplied', { silent: true })
      if (value) {
        this.applyPromoPricing(value, type, options)
      } else {
        this.removePromoPricing(value, type, options)
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
      const isGiftStore = (context.model.get('storeType') === 'Gift')
      // debugger
      if (value && isDiscountRate && isGiftStore) {
        console.log('apply discountRate gifting')
        const quantity = parseInt(value.quantity, 10)
        const giftItem = context.model.get('DiscountRate').find(({ count }) => count === quantity)
        const amount = parseFloat(giftItem.Amount)
        let total = 0
        context.model.get('DiscountRate').forEach((item) => {
          if (item.count <= quantity) {
            total = parseFloat(total) + parseFloat(item.Amount)
          }
        })
        total = parseFloat(total.toFixed(2))
        const gift = {
          gift: {
            quantity,
            amount,
            total,
          },
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

  applyPromoPricing(value, type, options) {
    console.log('ShoppingCart applyPromoPricing')
    console.log(value, type, options)
    // const { context } = options
    // debugger
    const {
      // PromotionCode,
      // Name,
      // StripeDuration,
      // StripeDurationInMonths,
      // StripeOrg,
      // MembershipTerm,
      // MembershipTermType,
      StripeAmountOff,
      StripePercentOff,
      // CountryRequirement,
      // PlanTermRequirement,
      // PromoCustomerRequirements,
    } = value

    if (this.has(type)) {
      const {
        quantity,
        amount,
        // total,
      } = this.get(type)

      const discountedMembership = {}
      let discountedAmount = amount
      let discountedTotal = (quantity * amount)
      if (StripePercentOff) {
        discountedAmount = amount - (amount * (StripePercentOff / 100))
        discountedTotal = quantity * discountedAmount
      }

      if (StripeAmountOff) {
        discountedAmount = amount - StripeAmountOff
        discountedTotal = discountedAmount + ((quantity - 1) * discountedAmount)
      }

      discountedMembership[type] = {
        quantity,
        amount: parseFloat(discountedAmount.toFixed(2)),
        total: parseFloat(discountedTotal.toFixed(2)),
      }
      this.set(discountedMembership)
    }
  }

  removePromoPricing(value, type, options) {
    console.log('ShoppingCart removePromoPricing')
    console.log(value, type, options)
    const { context } = options
    // debugger
    if (this.has(type)) {
      const { quantity } = this.get(type)
      const amount = context.model.get(`${type}StripePlan`).SubscriptionAmount
      const total = parseFloat((quantity * amount).toFixed(2))
      const data = {}
      data[type] = {
        quantity,
        amount,
        total,
      }
      this.set(data)
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

  getTotalTimelinePromomotionAmount(discountRate) {
    let total = 0
    const { quantity } = this.get('gift')
    _.each(discountRate, (value, key, list) => {
      console.log(value, key, list)
      if (value.count <= quantity) {
        total = parseFloat(total) + parseFloat(value.Amount)
      }
    })
    return parseFloat(total.toFixed(2))
  }

  emptyCart(model, context) {
    this.set({
      monthly: {
        amount: model.get('monthlyStripePlan').SubscriptionAmount,
        quantity: 0,
        total: model.get('monthlyStripePlan').SubscriptionAmount,
      },
      annual: {
        amount: model.get('annualStripePlan').SubscriptionAmount,
        quantity: 0,
        total: model.get('annualStripePlan').SubscriptionAmount,
      },
    })
    model.get('cart').unset('gift', { context })
    model.unset('membershipPromo')
  }
}

export default ShoppingCart
