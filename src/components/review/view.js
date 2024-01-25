import Backbone, { View } from 'backbone'

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

    // if car is empty then send the customer back to their respective first page
    if (this.cart.getTotalQuantity() === 0) {
      if (this.model.get('storeType') === 'Gift') {
        Backbone.history.navigate('give', { trigger: true })
      } else {
        Backbone.history.navigate('membership', { trigger: true })
      }
      return
    }

    const attributes = {
      Country: this.model.get('BillingAddress').Country,
      PostalCode: this.model.get('BillingAddress').PostalCode,
      Amount: this.cart.getTotalAmount(), // Weird typo from the API `Ammount` with 2m's
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

    this.listenTo(this.reviewModel, 'change:reviewModelSuccess', (model, value) => {
      console.log(model, value)
      debugger
      if (value) {
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
    const attributes = {
      name: this.model.get('Customer').Name,
      membershipUserImg,
      giftBoxImg,
      annualQuantity: this.cart.getItemQuantity('annual'),
      annualPrice: [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        this.cart.getItemTotalAmount('annual'),
      ].join(''),
      monthlyQuantity: this.cart.getItemQuantity('monthly'),
      monthlyPrice: [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        this.cart.getItemTotalAmount('monthly'),
      ].join(''),
      giftQuantity: this.cart.getItemQuantity('gift'),
      giftPrice: [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        this.cart.getItemTotalAmount('gift'),
      ].join(''),
      total: [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        this.cart.getTotalAmount(),
      ].join(''),
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
}

export default Review
