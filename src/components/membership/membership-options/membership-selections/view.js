import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class MembershipSelections extends View {
  get el() {
    return '#membership-options'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'change input[type="radio"]': 'updateMembershipPlan',
    }
  }

  initialize() {
    console.log('MembershipSelections initialize')
    this.cart = this.model.get('cart')
    // const isLoggedIn = this.model.get('Session').LoggedIn
    // const isRecordedBook = (
    //   this.model.has('Membership')
    //   && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    // )

    this.listenTo(this.model, 'change:membershipPromo', (model, value, options) => {
      console.log(model, value, options)
      debugger
      this.resetMonthlyPricing()
      this.resetAnnualPricing()
    })

    this.listenTo(this.cart, 'change:monthly', (model, value, options) => {
      console.log(model, value, options)
      // debugger
      if (this.model.has('membershipPromo')) {
        if (value.total > 0) {
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
            value.total,
          ].join('')

          const oldPricingContainer = $('<del>').append($('<span>').addClass('old-pricing').html(oldPricing))
          const newPricingContainer = $('<span>').html(newPricing).append(oldPricingContainer)

          // this.$el.find('.annual-plan-message span').addClass('applied-success').html(pricing)
          // this.$el.find('#billing-container .legal-notice span').html(pricing)
          this.$el.find('.plan.monthly .h4 span').replaceWith(newPricingContainer)
        }
      } else {
        this.resetMonthlyPricing()
      }
    })

    this.listenTo(this.cart, 'change:annual', (model, value, options) => {
      console.log(model, value, options)
      debugger
      if (this.model.has('membershipPromo')) {
        if (value.total > 0) {
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
            value.total,
          ].join('')

          const oldPricingContainer = $('<del>').append($('<span>').addClass('old-pricing').html(oldPricing))
          const newPricingContainer = $('<span>').html(newPricing).append(oldPricingContainer)

          // this.$el.find('.annual-plan-message span').addClass('applied-success').html(pricing)
          // this.$el.find('#billing-container .legal-notice span').html(pricing)
          this.$el.find('.plan.annual .h4 span').replaceWith(newPricingContainer)
        }
      } else {
        this.resetAnnualPricing()
      }
    })

    // const isGroupNameAllowedGifting = true // this.model.get('isGroupNameAllowedGifting')
    // const membershipActive = this.model.get('Membership').Status.toUpperCase() === 'ACTIVE'
    const monthlyPlanPrice = [
      this.model.get('monthlyStripePlan').CurrencyDesc,
      this.model.get('monthlyStripePlan').CurrSymbol,
      this.model.get('monthlyStripePlan').SubscriptionAmount,
    ].join('')
    const annualPlanPrice = [
      this.model.get('annualStripePlan').CurrencyDesc,
      this.model.get('annualStripePlan').CurrSymbol,
      this.model.get('annualStripePlan').SubscriptionAmount,
    ].join('')

    this.model.set({
      monthlyPlanPrice,
      annualPlanPrice,
    })

    this.render()
  }

  render() {
    console.log('MembershipSelections render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.append(html)

    this.selectDefaultPlan()

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

    this.$el.find(`#membershipItem input[type="radio"][value="${this.membershipType}"]`).prop('checked', true)

    this.updateCart()
  }

  updateMembershipPlan(e) {
    console.log('MembershipSelections updateMembershipPlan')
    e.preventDefault()
    console.log(e.target.value)
    this.membershipType = e.target.value
    // debugger
    this.$el.find(`#membershipItem input[type="radio"][value="${this.membershipType}"]`).prop('checked', true)

    this.updateCart()
  }

  updateCart() {
    console.log('MembershipGiftOptions updateCart')
    const otherMembershipType = (this.membershipType === 'monthly') ? 'annual' : 'monthly'
    const membership = {}
    const other = {}
    const quantity = 1
    const otherQuantity = 0
    let amount = 0
    let otherAmount = 0
    if (this.model.has('membershipPromo')) {
      amount = this.cart.get(this.membershipType).amount
      otherAmount = this.cart.get(otherMembershipType).amount
    } else {
      amount = this.model.get(`${this.membershipType}StripePlan`).SubscriptionAmount
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

    membership[this.membershipType] = {
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

  resetMonthlyPricing() {
    console.log('MembershipGiftOptions resetMonthlyPricing')
    const container = this.$el.find('#membershipItem')
    const monthlyPlanContainer = container.find('.plan.monthly')
    const monthlyAmount = [
      this.model.get('monthlyStripePlan').CurrencyDesc,
      this.model.get('monthlyStripePlan').CurrSymbol,
      this.model.get('monthlyStripePlan').SubscriptionAmount,
    ].join('')

    monthlyPlanContainer
      .find('span')
      .html(monthlyAmount)
  }

  resetAnnualPricing() {
    console.log('MembershipGiftOptions resetAnnualPricing')
    const container = this.$el.find('#membershipItem')
    const annualPlanContainer = container.find('.plan.yearly')
    const annualAmount = [
      this.model.get('annualStripePlan').CurrencyDesc,
      this.model.get('annualStripePlan').CurrSymbol,
      this.model.get('annualStripePlan').SubscriptionAmount,
    ].join('')

    annualPlanContainer
      .find('span')
      .html(annualAmount)
  }
}

export default MembershipSelections
