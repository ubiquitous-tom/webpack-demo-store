import Backbone, { View } from 'backbone'
import _ from 'underscore'

import BackBoneContext from 'core/contexts/backbone-context'
import ProfileModel from 'core/models/profile'
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
    this.mp = this.context.getContext('mp')

    this.profile = new ProfileModel()

    this.listenTo(this.model, 'thankYou:undelegateEvents', () => {
      console.log('ThankYou garbageCollect')
      this.remove()
      // debugger
    })

    this.listenTo(this.profile, 'change:profileSuccess', (model, value) => {
      console.log(model, value)
      // debugger
      console.log(model.has('Subscription'), model.get('Subscription')?.Status)
      let isSubscribedPostProcess = false
      if (value) {
        // debugger
        if (
          model.has('Subscription')
          && model.get('Subscription')?.Status.includes('ACTIVE')
        ) {
          isSubscribedPostProcess = true
        }
      }

      const isSubscribedPreProcess = this.model.get('isSubscribedPreProcess')
      // debugger
      if (
        isSubscribedPostProcess === true
        && isSubscribedPreProcess !== isSubscribedPostProcess
      ) {
        const annualQuantity = this.cart.getItemQuantity('annual')
        const membershipType = (annualQuantity > 0) ? 'annualStripePlan' : 'monthlyStripePlan'
        // debugger
        // Store service currently does not have trial
        const additionalAttr = {
          category: this.model.get(membershipType).TermType === 'MONTH' ? 'annual' : 'monthly',
          trial_duration: 0, // this.model.get(membershipType).TrialDays,
          sku: this.model.get(membershipType).PlanID,
        }
        // debugger
        this.mp.customEvent('Subscribe', additionalAttr)
      }
    })

    if (!this.model.has('orderId')) {
      if (this.model.get('storeType') === 'Membership') {
        Backbone.history.navigate('membership', { trigger: true })
      } else {
        Backbone.history.navigate('give', { trigger: true })
      }
      this.model.trigger('thankYou:undelegateEvents')
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
    // debugger
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

    $('body')[0].scrollIntoView({ behavior: 'smooth' })

    // load profile to check post-purchase subscription status
    this.checkProfile()

    return this
  }

  checkProfile() {
    const email = this.model.get('purchaseEmail') || ''
    if (!_.isEmpty(email)) {
      this.profile.loadProfile(email)
    }
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
}

export default ThankYou
