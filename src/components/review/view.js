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
      return
    }

    // not logged in then send back the customer back to  their respective first page
    if (!this.model.get('Session')?.LoggedIn) {
      if (this.model.get('storeType') === 'Gift') {
        Backbone.history.navigate('give', { trigger: true })
      } else {
        Backbone.history.navigate('membership', { trigger: true })
      }
      return
    }
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

    this.listenTo(this.model, 'review:clearPurchase', () => {
      console.log('Review review:clearPurchase')
      if (this.model.get('storeType') === 'Gift') {
        Backbone.history.navigate('give', { trigger: true })
      } else {
        Backbone.history.navigate('membership', { trigger: true })
      }
    })

    this.listenTo(this.reviewModel, 'change:purchaseSuccess', (model, value) => {
      console.log(model, value)
      // debugger
      if (value) {
        this.model.set({
          orderId: model.get('OrderID'),
        })
        Backbone.history.navigate('thankYou', { trigger: true })
      } else {
        this.popup.modalError(model.get('message'))
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
          // this.$el
          //   .find('.tax-placeholder')
          //   .html(estimatedTaxPrice)
        }
      } else {
        // this.$el
        //   .find('.tax-placeholder')
        //   .html(estimatedTaxPrice)
      }
      // this.$('.order-summary').find('.tax-placeholder').html(translatedText)
      this.model.set({
        estimatedTaxPrice,
      })

      this.render()
    })
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
      giftPrice: [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        this.cart.getItemTotalAmount('gift'),
      ].join(''),
      total: this.applyTotalPromoPrice([
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        this.cart.getTotalAmount(),
      ].join('')),
      estimatedTaxPrice: this.model.get('estimatedTaxPrice'),
    }
    const html = this.template(attributes)
    this.$el.html(html)

    // this.popup.render()

    return this
  }

  editBilling(e) {
    console.log('Review editBilling')
    e.preventDefault()
    Backbone.history.navigate('editBilling', { trigger: true })
  }

  // editQuantity(e) {
  //   console.log('Review editQuantity')
  //   e.preventDefault()
  //   Backbone.history.navigate('give', { trigger: true })
  // }

  submitPurchase(e) {
    console.log('Review submitPurchase')
    e.preventDefault()

    this.$el
      .find('.submit-order')
      .prop('disabled', true)

    this.reviewModel.submit(this.model)
  }

  clearPurchase(e) {
    console.log('Review clearPurchase')
    e.preventDefault()
    this.cart.emptyCart()
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
      const oldPrice = [
        this.gifting.get('gift').CurrSymbol,
        this.model.get(`${type}StripePlan`).SubscriptionAmount,
      ].join('')
      const newPrice = [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        Intl.NumberFormat(`${this.model.get('stripePlansLang')}-IN`, { maximumFractionDigits: 2, minimumFractionDigits: 2, trailingZeroDisplay: 'stripIfInteger' }).format(this.cart.getItemAmount('monthly')),
      ].join('')
      return `<span>${newPrice}<del> <span class="old-pricing">${oldPrice}</span></del></span>`
    }

    return originalPrice
  }

  applyTotalPromoPrice(originalPrice) {
    if (this.model.has('membershipPromo')) {
      const oldTotal = this.getTotalAmount()
      const oldPrice = [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        Intl.NumberFormat(`${this.model.get('stripePlansLang')}-IN`, { maximumFractionDigits: 2, minimumFractionDigits: 2, trailingZeroDisplay: 'stripIfInteger' }).format(oldTotal),
      ].join('')
      const newTotal = this.cart.getTotalAmount()
      const newPrice = [
        this.gifting.get('gift').CurrSymbol,
        Intl.NumberFormat(`${this.model.get('stripePlansLang')}-IN`, { maximumFractionDigits: 2, minimumFractionDigits: 2, trailingZeroDisplay: 'stripIfInteger' }).format(newTotal),
      ].join('')
      return `<span>${newPrice}<del> <span class="old-pricing">${oldPrice}</span></del></span>`
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
}

export default Review
