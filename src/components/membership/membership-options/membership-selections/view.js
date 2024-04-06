import { View } from 'backbone'

import Promo from 'shared/elements/promo'

import './stylesheet.scss'
import template from './index.hbs'

import MembershipSelectionsMonthly from './monthly/view'
import MembershipSelectionsAnnual from './annual/view'

class MembershipSelections extends View {
  get el() {
    return '#membership-options'
  }

  get template() {
    return template
  }

  // get events() {
  //   return {
  //     'change input[type="radio"]': 'updateMembershipPlan',
  //   }
  // }

  initialize(options) {
    console.log('MembershipSelections initialize')
    this.i18n = options.i18n
    this.cart = this.model.get('cart')
    this.gifting = this.model.get('gifting')

    this.promoView = new Promo(this.model.attributes)
    // const isLoggedIn = this.model.get('Session').LoggedIn
    // const isRecordedBook = (
    //   this.model.has('Membership')
    //   && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    // )

    this.listenTo(this.model, 'membership:undelegateEvents', () => {
      console.log('MembershipSelections garbageCollect')
      this.remove()
      // debugger
    })

    // this.listenTo(this.model, 'change:membershipPromo', (model, value, options) => {
    //   console.log(model, value, options)
    //   // debugger
    //   this.cart.trigger('cart:promoCodeApplied', value, type, options)
    //   // this.resetMonthlyPricing()
    //   // this.resetAnnualPricing()
    // })

    /*
    this.listenTo(this.cart, 'change:monthly', (model, value, options) => {
      console.log(model, value, options)
      // debugger
      this.updateMonthlyPricing(value.total)
    })

    this.listenTo(this.cart, 'change:annual', (model, value, options) => {
      console.log(model, value, options)
      // debugger
      this.updateAnnualPricing(value.total)
    })
    */

    this.render()
  }

  render() {
    console.log('MembershipSelections render')
    console.log(this.model.attributes)
    /*
    const monthlyAmount = this.model.get('monthlyStripePlan').SubscriptionAmount
    const monthlyPlanPrice = this.applyPromoPrice([
      this.model.get('monthlyStripePlan').CurrencyDesc,
      this.model.get('monthlyStripePlan').CurrSymbol,
      this.model.get('monthlyStripePlan').SubscriptionAmount,
    ].join(''), 'monthly')
    const monthlyPlanID = this.model.get('monthlyStripePlan').PlanID

    const annualAmount = this.model.get('annualStripePlan').SubscriptionAmount
    const annualPlanPrice = this.applyPromoPrice([
      this.model.get('annualStripePlan').CurrencyDesc,
      this.model.get('annualStripePlan').CurrSymbol,
      this.model.get('annualStripePlan').SubscriptionAmount,
    ].join(''), 'annual')
    const annualPlanID = this.model.get('annualStripePlan').PlanID

    const attributes = {
      monthlyAmount,
      monthlyPlanID,
      monthlyPlanPrice,
      annualAmount,
      annualPlanID,
      annualPlanPrice,
    }
    */
    const html = this.template()
    this.$el.append(html)

    this.setElement('#membershipItem')

    // this.selectDefaultPlan()

    this.membershipSelectionsMonthly = new MembershipSelectionsMonthly({
      model: this.model,
      i18n: this.i18n,
      parentView: this,
    })
    this.membershipSelectionsAnnual = new MembershipSelectionsAnnual({
      model: this.model,
      i18n: this.i18n,
      parentView: this,
    })

    // Remove preset options like `promo code` and `plan`
    // once we already saved the information to the session Storage
    // for a `GUEST`, `CANCELED`, or `EXPIRED` membership
    const isValidAccount = (this.model.has('Membership') && this.model.has('Subscription'))
    if (isValidAccount) {
      debugger
      this.promoView.removePresetOptions()
    }

    return this
  }

  selectDefaultPlan() {
    const isMembershipActive = (this.model.has('Membership') && this.model.get('Membership').Status === 'ACTIVE')
    const isMembershipType = (this.model.has('Subscription') && this.model.get('Subscription').Type)
    this.membershipType = 'monthly'
    if (isMembershipActive && isMembershipType) {
      if (this.model.get('Subscription').Type.toUpperCase() === 'ANNUAL') {
        this.membershipType = 'annual'
      }
    }

    //  If we already have annual membership in the cart from `/#give` page
    if (this.cart.has('annual')) {
      if (this.cart.get('annual').quantity > 0) {
        this.membershipType = 'annual'
      }
    }

    this.$(`input[type="radio"][value="${this.membershipType}"]`).prop('checked', true)
    this.model.set({
      currentPlanID: this.model.get(`${this.membershipType}StripePlan`).PlanID,
    })

    this.updateCart(this.membershipType)
  }

  /*
  updateMembershipPlan(e) {
    console.log('MembershipSelections updateMembershipPlan')
    e.preventDefault()
    console.log(e.target.value)
    this.membershipType = e.target.value
    // debugger
    this.$(`input[type="radio"][value="${this.membershipType}"]`).prop('checked', true)

    this.updateCart()
  }
  */

  updateCart(membershipType) {
    console.log('MembershipGiftOptions updateCart')
    const otherMembershipType = (membershipType === 'monthly') ? 'annual' : 'monthly'
    const membership = {}
    const other = {}
    const quantity = 1
    const otherQuantity = 0
    let amount = 0
    let otherAmount = 0
    if (this.model.has('membershipPromo')) {
      amount = this.cart.get(membershipType).amount
      otherAmount = this.cart.get(otherMembershipType).amount
    } else {
      amount = this.model.get(`${membershipType}StripePlan`).SubscriptionAmount
      otherAmount = this.model.get(`${otherMembershipType}StripePlan`).SubscriptionAmount
    }
    const total = parseFloat((quantity * amount).toFixed(2))
    const otherTotal = parseFloat((otherQuantity * otherAmount).toFixed(2))
    // debugger

    // this.cart.unset(otherMembership, { silent: true })
    other[otherMembershipType] = {
      quantity: otherQuantity,
      amount: otherAmount,
      total: otherTotal,
    }

    this.cart.set(other, { context: this })

    membership[membershipType] = {
      quantity,
      amount,
      total,
    }

    this.cart.set(membership, { context: this })

    // Set default Stripe plans
    // this.cart.set({
    //   monthlyStripePlan: this.model.get('monthlyStripePlan'),
    //   annualStripePlan: this.model.get('annualStripePlan'),
    // })

    console.log(this.model.attributes)
  }

  /*
  updateMonthlyPricing(total) {
    if (this.model.has('membershipPromo')) {
      if (total > 0 && (total !== this.model.get('monthlyStripePlan').SubscriptionAmount)) {
        // const subscriptionAmount = this.plans.getMonthly().price
        // const discountedPrice = subscriptionAmount - ((value * subscriptionAmount) / 100)
        // const promoAppliedAmount = (Math.floor(discountedPrice * 100) / 100).toFixed(2)
        const oldPricing = [
          this.model.get('monthlyStripePlan').CurrSymbol,
          this.model.get('monthlyStripePlan').SubscriptionAmount,
        ].join('')
        const newPricing = [
          this.model.get('monthlyStripePlan').CurrencyDesc,
          this.model.get('monthlyStripePlan').CurrSymbol,
          Intl.NumberFormat(
            'en-IN',
            {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
              trailingZeroDisplay: 'stripIfInteger',
            },
          ).format(total),
        ].join('')

        const oldPricingContainer = $('<del>')
          .append($('<span>').addClass('old-pricing').html(oldPricing))
        const newPricingContainer = $('<span>')
          .html(newPricing)
          .append(oldPricingContainer)

        // this.$('.annual-plan-message span').addClass('applied-success').html(pricing)
        // this.$('#billing-container .legal-notice span').html(pricing)
        this.$('.plan.monthly .h4 span').replaceWith(newPricingContainer)
      }
    } else {
      this.resetMonthlyPricing()
    }
  }
  */

  /*
  updateAnnualPricing(total) {
    if (this.model.has('membershipPromo')) {
      if (total > 0 && (total !== this.model.get('annualStripePlan').SubscriptionAmount)) {
        // const subscriptionAmount = this.plans.getMonthly().price
        // const discountedPrice = subscriptionAmount - ((value * subscriptionAmount) / 100)
        // const promoAppliedAmount = (Math.floor(discountedPrice * 100) / 100).toFixed(2)
        const oldPricing = [
          this.model.get('annualStripePlan').CurrSymbol,
          this.model.get('annualStripePlan').SubscriptionAmount,
        ].join('')
        const newPricing = [
          this.model.get('annualStripePlan').CurrencyDesc,
          this.model.get('annualStripePlan').CurrSymbol,
          Intl.NumberFormat(
            `${this.model.get('stripePlansLang')}-IN`,
            {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
              trailingZeroDisplay: 'stripIfInteger',
            },
          ).format(total),
        ].join('')

        const oldPricingContainer = $('<del>').append($('<span>')
          .addClass('old-pricing').html(oldPricing))
        const newPricingContainer = $('<span>').html(newPricing).append(oldPricingContainer)

        // this.$('.annual-plan-message span').addClass('applied-success').html(pricing)
        // this.$('#billing-container .legal-notice span').html(pricing)
        this.$('.plan.annual .h4 span').replaceWith(newPricingContainer)
      }
    } else {
      this.resetAnnualPricing()
    }
  }
  */

  applyPromoPrice(originalPrice, type) {
    if (this.model.has('membershipPromo')) {
      const ogPrice = this.model.get(`${type}StripePlan`).SubscriptionAmount
      const nowPrice = this.cart.getItemAmount(type)
      if (ogPrice !== nowPrice) {
        const oldPrice = [
          this.gifting.get('gift').CurrSymbol,
          this.model.get(`${type}StripePlan`).SubscriptionAmount,
        ].join('')
        const newPrice = [
          this.gifting.get('gift').CurrencyDesc,
          this.gifting.get('gift').CurrSymbol,
          this.cart.getItemAmount(type),
        ].join('')
        return `<span>${newPrice}<del><span class="old-pricing">${oldPrice}</span></del></span>`
      }
    }

    return originalPrice
  }

  /*
  resetMonthlyPricing() {
    console.log('MembershipGiftOptions resetMonthlyPricing')
    const monthlyPlanContainer = this.$('.plan.monthly')
    const monthlyAmount = [
      this.model.get('monthlyStripePlan').CurrencyDesc,
      this.model.get('monthlyStripePlan').CurrSymbol,
      this.model.get('monthlyStripePlan').SubscriptionAmount,
    ].join('')

    monthlyPlanContainer
      .find('span')
      .html(monthlyAmount)
  }
  */

  /*
  resetAnnualPricing() {
    console.log('MembershipGiftOptions resetAnnualPricing')
    const annualPlanContainer = this.$('.plan.yearly')
    const annualAmount = [
      this.model.get('annualStripePlan').CurrencyDesc,
      this.model.get('annualStripePlan').CurrSymbol,
      this.model.get('annualStripePlan').SubscriptionAmount,
    ].join('')

    annualPlanContainer
      .find('span')
      .html(annualAmount)
  }
  */
}

export default MembershipSelections
