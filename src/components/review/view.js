import Backbone, { View } from 'backbone'
import _ from 'underscore'

import PaymentEstimation from 'core/models/payment-estimation'

import './stylesheet.scss'

import membershipUserImg from './img/membership-user.png'
import giftBoxImg from './img/gift-box.png'
import template from './index.hbs'
import ReviewModal from './partials'

import ReviewModel from './model'

class Review extends View {
  get el() {
    return '#content-section'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click #editBilling': 'editBilling',
      // 'click #editQuantity': 'editQuantity',
      'click .submit-order': 'submitPurchase',
      'click #cancelOrder': 'clearPurchase',
      'click .remove': 'memberRemove',
      // 'change #promo-code': 'checkPromoCode',
    }
  }

  initialize(options) {
    console.log('Review initialize')
    this.i18n = options.i18n
    this.cart = this.model.get('cart')
    this.gifting = this.model.get('gifting')
    this.paymentEstimation = new PaymentEstimation()
    this.popup = new ReviewModal({ model: this.model, i18n: this.i18n })
    this.reviewModel = new ReviewModel()

    // // if the cart is empty then send the customer back to their respective first page
    if (this.cart.getTotalQuantity() === 0) {
      if (this.model.get('storeType') === 'Gift') {
        Backbone.history.navigate('give', { trigger: true })
      } else {
        Backbone.history.navigate('membership', { trigger: true })
      }
      this.model.trigger('reviewPurchase:undelegateEvents')
      return
    }

    // // not logged in then send back the customer back to  their respective first page
    // if (!this.model.get('Session')?.LoggedIn) {
    //   if (this.model.get('storeType') === 'Gift') {
    //     Backbone.history.navigate('give', { trigger: true })
    //   } else {
    //     Backbone.history.navigate('membership', { trigger: true })
    //   }
    //   this.model.trigger('reviewPurchase:undelegateEvents')
    //   return
    // }
    // debugger
    let Country = 'US'
    let PostalCode = '90210'
    if (this.model.has('BillingAddress')) {
      Country = this.model.get('BillingAddress').Country
      PostalCode = this.model.get('BillingAddress').PostalCode
    } else {
      Country = this.model.get('editBillingForm').address_country
      PostalCode = this.model.get('editBillingForm').address_zip
    }
    const attributes = {
      Country,
      PostalCode,
      Amount: this.cart.getTotalAmount(),
    }
    // debugger
    this.paymentEstimation.getPaymentEstimation(attributes)

    this.listenTo(this.model, 'reviewPurchase:undelegateEvents', () => {
      console.log('Review garbageCollect')
      this.remove()
      // debugger
    })

    this.listenTo(this.model, 'review:clearPurchase', () => {
      console.log('Review review:clearPurchase')
      if (this.model.get('storeType') === 'Gift') {
        Backbone.history.navigate('give', { trigger: true })
      } else {
        Backbone.history.navigate('membership', { trigger: true })
      }
      this.model.trigger('reviewPurchase:undelegateEvents')
    })

    this.listenTo(this.reviewModel, 'change:purchaseSuccess', (model, value) => {
      console.log(model, value)
      // debugger
      if (value) {
        this.model.set({
          orderId: model.get('OrderID'),
        })
        Backbone.history.navigate('thankYou', { trigger: true })
        this.model.trigger('reviewPurchase:undelegateEvents')
      } else {
        this.popup.modalError(model.get('message'))
        this
          .$('.submit-order')
          .prop('disabled', false)
      }
    })

    this.listenTo(this.paymentEstimation, 'change:paymentEstimationSuccess', (model, value) => {
      console.log(model, value)
      let estimatedTaxPrice = this.i18n.t('TAX-APPLICABLE')
      // debugger
      if (value) {
        const taxInfo = parseFloat(model.get('TotalTaxCalculated').toFixed(2))
        if (taxInfo > 0) {
          const estimatedTax = [
            this.gifting.get('gift').CurrencyDesc,
            this.gifting.get('gift').CurrSymbol,
            taxInfo,
          ].join('')
          // translatedText = this.i18n.t('TAX-ESTIMATED-TAXES-POLYGLOT', { var1: estimatedTax })
          estimatedTaxPrice = this.i18n.t('TAX-ESTIMATED-TAXES-HANDLEBARS', { estimatedTax })
          // this
          //   .$('.tax-placeholder')
          //   .html(estimatedTaxPrice)
        }
        this.model.set({
          estimatedTaxPrice,
        })

        this
          .$('.tax-placeholder')
          .html(estimatedTaxPrice)
      }
    })

    this.render()
  }

  render() {
    console.log('Review render')
    console.log(this.model.attributes)
    const membershipPromo = this.model.has('membershipPromo')
    const attributes = {
      name: this.model.get('Customer').Name,
      membershipUserImg,
      giftBoxImg,
      annualQuantity: this.cart.getItemQuantity('annual'),
      annualPrice: this.applyMembershipPromoPrice([
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        this.cart.getItemTotalAmount('annual'),
      ].join(''), 'annual'),
      monthlyQuantity: this.cart.getItemQuantity('monthly'),
      monthlyPrice: this.applyMembershipPromoPrice([
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        this.cart.getItemTotalAmount('monthly'),
      ].join(''), 'monthly'),
      membershipPromo,
      promoName: membershipPromo ? this.model.get('membershipPromo').Name : '',
      giftQuantity: this.cart.getItemQuantity('gift'),
      giftPrice: this.timelinePromotionPrice([
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        this.cart.getItemTotalAmount('gift'),
      ].join('')),
      total: this.applyTotalPromoPrice([
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        this.cart.getTotalAmount(),
      ].join('')),
      estimatedTaxPrice: this.i18n.t('TAX-APPLICABLE'), // this.model.get('estimatedTaxPrice'),
    }
    const html = this.template(attributes)
    this.$el.html(html)

    this.setElement('.review.store.container')
    // this.popup.render()

    $('body')[0].scrollIntoView({ behavior: 'smooth' })

    return this
  }

  editBilling(e) {
    console.log('Review editBilling')
    e.preventDefault()
    Backbone.history.navigate('editBilling', { trigger: true })
    this.model.trigger('reviewPurchase:undelegateEvents')
  }

  // editQuantity(e) {
  //   console.log('Review editQuantity')
  //   e.preventDefault()
  //   Backbone.history.navigate('give', { trigger: true })
  // }

  submitPurchase(e) {
    console.log('Review submitPurchase')
    e.preventDefault()

    this
      .$('.submit-order')
      .prop('disabled', true)

    this.reviewModel.submit(this.model)
  }

  clearPurchase(e) {
    console.log('Review clearPurchase')
    e.preventDefault()
    this.cart.emptyCart(this.model, this)
    this.popup.modalClear()
  }

  memberRemove(e) {
    e.preventDefault()
    let annual = this.cart.get('annual')
    annual = _.defaults(annual, { quanityt: 0, total: 0 })
    this.cart.set(annual)

    this.render()
  }

  applyMembershipPromoPrice(originalPrice, type) {
    if (this.model.has('membershipPromo')) {
      const oldTotal = this.model.get(`${type}StripePlan`).SubscriptionAmount
      const oldPrice = [
        this.gifting.get('gift').CurrSymbol,
        oldTotal,
      ].join('')

      const newTotal = this.cart.getItemAmount(type)
      const newPrice = [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        Intl.NumberFormat(`${this.model.get('stripePlansLang')}-IN`, { maximumFractionDigits: 2, minimumFractionDigits: 2, trailingZeroDisplay: 'stripIfInteger' }).format(newTotal),
      ].join('')

      return (oldTotal !== newTotal)
        ? `<span>${newPrice}<del> <span class="old-pricing">${oldPrice}</span></del></span>`
        : originalPrice
    }

    return originalPrice
  }

  applyTotalPromoPrice(originalPrice) {
    const isTimelinePromotion = this.model.has('DiscountRate')
    if (this.model.has('membershipPromo')) {
      const oldTotal = isTimelinePromotion
        ? this.getTotalAmountWithTimelinePromotion()
        : this.getTotalAmount()
      const oldPrice = [
        this.gifting.get('gift').CurrSymbol,
        Intl.NumberFormat(`${this.model.get('stripePlansLang')}-IN`, { maximumFractionDigits: 2, minimumFractionDigits: 2, trailingZeroDisplay: 'stripIfInteger' }).format(oldTotal),
      ].join('')

      const newTotal = isTimelinePromotion
        ? this.getTotalAmountWithPromoCodeWithTimelinePromotion()
        : this.cart.getTotalAmount()
      const newPrice = [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        Intl.NumberFormat(`${this.model.get('stripePlansLang')}-IN`, { maximumFractionDigits: 2, minimumFractionDigits: 2, trailingZeroDisplay: 'stripIfInteger' }).format(newTotal),
      ].join('')

      return (oldTotal !== newTotal)
        ? `<span>${newPrice}<del> <span class="old-pricing">${oldPrice}</span></del></span>`
        : originalPrice
    }

    if (isTimelinePromotion) {
      const total = this.getTotalAmountWithTimelinePromotion()
      const timelinePromotionPrice = [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        Intl.NumberFormat(`${this.model.get('stripePlansLang')}-IN`, { maximumFractionDigits: 2, minimumFractionDigits: 2, trailingZeroDisplay: 'stripIfInteger' }).format(total),
      ].join('')

      return timelinePromotionPrice
    }

    return originalPrice
  }

  getTotalAmount() {
    const { attributes } = this.cart
    let total = 0
    _.each(attributes, (value, key, list) => {
      console.log(value, key, list)
      let fullAmount = value.amount
      if (key !== 'gift') {
        fullAmount = this.model.get(`${key}StripePlan`).SubscriptionAmount
      }
      total += value.quantity * fullAmount
    })
    return parseFloat(total.toFixed(2))
  }

  getTotalAmountWithTimelinePromotion() {
    let total = 0
    const monthly = this.cart.getItemQuantity('monthly') * this.model.get('monthlyStripePlan').SubscriptionAmount
    const annual = this.cart.getItemQuantity('annual') * this.model.get('annualStripePlan').SubscriptionAmount
    const gift = this.cart.get('gift').total
    total = parseFloat((monthly + annual + gift).toFixed(2))
    return total
  }

  getTotalAmountWithPromoCodeWithTimelinePromotion() {
    let total = 0
    const monthly = this.cart.getItemTotalAmount('monthly')
    const annual = this.cart.getItemTotalAmount('annual')
    const gift = this.cart.get('gift').total
    total = parseFloat((monthly + annual + gift).toFixed(2))
    return total
  }

  // TODO: need a mockup and how to display the Timeline Promotion pricing here
  timelinePromotionPrice(giftPrice) {
    const isGiftStore = (this.model.get('storeType') === 'Gift')
    const isDiscountRate = this.model.has('DiscountRate')
    if (isGiftStore && isDiscountRate) {
      const originalPrice = [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        this.cart.get('gift').total, // this.gifting.get('gift').amount,
      ].join('')
      return originalPrice
    }

    return giftPrice
  }
}

export default Review
