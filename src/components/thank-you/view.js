import { Model, View } from 'backbone'

import BackBoneContext from 'core/contexts/backbone-context'
import docCookies from 'doc-cookies'

import './stylesheet.scss'
import membershipUserImg from './img/membership-user.png'
import template from './index.hbs'

class ThankYou extends View {
  get el() {
    return '#contentSecion'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('ThankYou initialize')
    this.cart = this.model.get('cart')
    this.context = new BackBoneContext()
    this.ga = this.context.getContext('ga')

    this.thankYou = new Model()

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
    const total = [
      this.gifting.get('gift').CurrencyDesc,
      this.gifting.get('gift').CurrSymbol,
      this.cart.getTotalAmount(),
    ].join('')
    const estimatedTaxPrice = this.model.get('estimatedTaxPrice')
    debugger
    const annualMembership = this.cart.getItemQuantity('annual')
    const annualPrice = [
      this.gifting.get('gift').CurrencyDesc,
      this.gifting.get('gift').CurrSymbol,
      this.cart.getItemTotalAmount('annual'),
    ].join('')
    const annualQuantity = this.cart.getItemQuantity('annual')

    const monthlyMembership = this.cart.getItemQuantity('monthly')
    const monthlyPrice = [
      this.gifting.get('gift').CurrencyDesc,
      this.gifting.get('gift').CurrSymbol,
      this.cart.getItemTotalAmount('monthly'),
    ].join('')
    const monthlyQuantity = this.cart.getItemQuantity('monthly')

    const membership = (annualMembership || monthlyMembership)
    const environment = this.model.get('environment')
    debugger
    this.thankYou.set({
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
      membership,
      environment,
    })

    this.listenTo(this.thankYou, 'change:orderId', this.render)
  }

  render() {
    console.log('ThankYou render')
    console.log(this.model.attributes, this.thankYou.attributes)
    const html = this.template(this.thankYou.attributes)
    this.$el.html(html)

    this.googleAnalytics()
    this.endSession()

    return this
  }

  googleAnalytics() {
    // TODO: needs to be rewrite from UA -> GA4

    /* eslint-disable no-undef */
    ga('ecommerce:addTransaction', {
      id: this.thankYou.get('orderId'),
      revenue: this.thankYou.get('total'),
    })

    // push info to Google Analytics
    ga('ecommerce:addItem', {
      name: 'Acorn TV Gift',
      price: this.cart.getItemAmount('gift'),
      quantity: this.cart.getItemQuantity('gift'),
    })

    if (this.thankYou.get('annualMembership')) {
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
      transactionId: this.thankYou.get('orderID'),
      transactionTotal: this.thankYou.get('total'),
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
}

export default ThankYou
