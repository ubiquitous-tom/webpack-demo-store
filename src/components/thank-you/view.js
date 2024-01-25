import Backbone, { View } from 'backbone'
import _ from 'underscore'

import BackBoneContext from 'core/contexts/backbone-context'
import docCookies from 'doc-cookies'

import './stylesheet.scss'
import membershipUserImg from './img/membership-user.png'
import template from './index.hbs'

class ThankYou extends View {
  get el() {
    return '#content-section'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('ThankYou initialize')
    this.cart = this.model.get('cart')
    this.gifting = this.model.get('gifting')
    this.context = new BackBoneContext()
    this.ga = this.context.getContext('ga')

    if (!this.model.has('orderId')) {
      if (this.model.get('storeType') === 'Membership') {
        Backbone.history.navigate('membership', { trigger: true })
      } else {
        Backbone.history.navigate('give', { trigger: true })
      }
      return
    }

    this.render()
  }

  render() {
    console.log('ThankYou render')
    console.log(this.model.attributes)

    let giftStore = false
    let membershipStore = false
    if (this.model.get('storeType') === 'Gift') {
      giftStore = true
    }
    if (this.model.get('storeType') === 'Membership') {
      membershipStore = true
    }

    const giftQuantity = this.cart.getItemQuantity('gift')
    const orderId = this.model.get('orderId')
    const total = this.applyTotalPromoPrice([
      this.gifting.get('gift').CurrencyDesc,
      this.gifting.get('gift').CurrSymbol,
      this.cart.getTotalAmount(),
    ].join(''))
    const estimatedTaxPrice = this.model.get('estimatedTaxPrice')
    debugger
    const annualMembership = this.cart.getItemQuantity('annual')
    const annualPrice = this.applyMembershipPromoPrice([
      this.gifting.get('gift').CurrencyDesc,
      this.gifting.get('gift').CurrSymbol,
      this.cart.getItemTotalAmount('annual'),
    ].join(''), 'annual')
    const annualQuantity = this.cart.getItemQuantity('annual')

    const monthlyMembership = this.cart.getItemQuantity('monthly')
    const monthlyPrice = this.applyMembershipPromoPrice([
      this.gifting.get('gift').CurrencyDesc,
      this.gifting.get('gift').CurrSymbol,
      this.cart.getItemTotalAmount('monthly'),
    ].join(''), 'monthly')
    const monthlyQuantity = this.cart.getItemQuantity('monthly')
    const membershipPromo = this.model.has('membershipPromo')
    const promoName = membershipPromo ? this.model.get('membershipPromo').Name : ''

    const membership = (annualMembership || monthlyMembership)
    const environment = this.model.get('environment')

    const attributes = {
      giftStore,
      membershipStore,
      giftQuantity,
      orderId,
      total,
      estimatedTaxPrice,
      membershipUserImg,
      annualMembership,
      annualPrice,
      annualQuantity,
      monthlyMembership,
      monthlyPrice,
      monthlyQuantity,
      membershipPromo,
      promoName,
      membership,
      environment,
    }
    const html = this.template(attributes)
    this.$el.html(html)

    this.googleAnalytics()
    this.endSession()

    return this
  }

  googleAnalytics() {
    // TODO: needs to be rewrite from UA -> GA4

    const total = this.applyTotalPromoPrice([
      this.gifting.get('gift').CurrencyDesc,
      this.gifting.get('gift').CurrSymbol,
      this.cart.getTotalAmount(),
    ].join(''))

    /* eslint-disable no-undef */
    ga('ecommerce:addTransaction', {
      id: this.model.get('orderId'),
      revenue: total,
    })

    // push info to Google Analytics
    ga('ecommerce:addItem', {
      name: 'Acorn TV Gift',
      price: this.cart.getItemAmount('gift'),
      quantity: this.cart.getItemQuantity('gift'),
    })

    if (this.cart.getItemQuantity('annual')) {
      ga('ecommerce:addItem', {
        name: 'Personal Membership',
        price: this.cart.getItemAmount('annual'),
        quantity: this.cart.getItemQuantity('annual'),
      })
    }

    ga('ecommerce:send')

    /* BEGIN DATALAYER */
    const dataLayerProducts = []

    if (this.cart.getItemQuantity('gift')) {
      dataLayerProducts.push({
        sku: 'Acorn TV Gift',
        id: 'Acorn TV Gift',
        name: 'Acorn TV Gift',
        price: this.cart.getItemAmount('gift'),
        category: 'Gift',
        quantity: this.cart.getItemQuantity('gift'),
      })
    }

    if (this.cart.getItemQuantity('annual')) {
      let annualName = 'Annual'
      if (this.model.get('Membership').autoRenew) {
        annualName = `Auto ${annualName}`
      }

      dataLayerProducts.push({
        sku: annualName,
        id: annualName,
        name: annualName,
        price: this.cart.getItemAmount('annual'),
        category: 'Subcription',
        quantity: this.cart.getItemQuantity('annual'),
      })
    }

    if (this.cart.getItemQuantity('monthly')) {
      dataLayerProducts.push({
        sku: 'Monthly',
        id: 'Monthly',
        name: 'Monthly',
        price: this.cart.getItemAmount('monthly'),
        category: 'Subcription',
        quantity: this.cart.getItemQuantity('monthly'),
      })
    }

    dataLayer.push({
      transactionId: this.model.get('orderID'),
      transactionTotal: total,
      transactionProducts: dataLayerProducts,
      eventQuant: this.cart.getItemQuantity('gift'),
    })
    /* END DATALAYER */
  }

  endSession() {
    this.model.unset('BillingAddress')
    this.model.unset('Customer')
    this.model.unset('Membership')
    this.model.unset('PaymentMethod')
    this.model.unset('Subscription')
    this.model.unset('Session')

    docCookies.removeItem('ATVSessionCookie')
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

export default ThankYou
