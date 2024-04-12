import { View } from 'backbone'

import PromoValidateModel from 'core/models/promo-validate'
import Promo from 'shared/elements/promo'

// import './stylesheet.scss'
import template from './index.hbs'

class MembershipSelectionsMonthly extends View {
  get el() {
    return 'section.plan.monthly'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'change input[type="radio"]': 'updateMembershipPlan',
    }
  }

  initialize(options) {
    console.log('MembershipSelectionsMonthly initialize')
    this.i18n = options.i18n
    this.parentView = options.parentView
    this.cart = this.model.get('cart')
    this.gifting = this.model.get('gifting')

    this.promoValidateModel = new PromoValidateModel(this.model.attributes)
    this.promoView = new Promo({ i18n: this.i18n })

    this.listenTo(this.model, 'membership:undelegateEvents', () => {
      console.log('MembershipSelectionsMonthly garbageCollect')
      this.remove()
      // debugger
    })

    this.listenTo(this.promoValidateModel, 'change:promoCodeSuccess', (model, value) => {
      console.log(model, value)
      console.log(this, this.model.attributes)
      // debugger
      model.unset('promoCodeSuccess', { silent: true })
      let { message } = model.get('flashMessage')
      let type = false
      if (value) {
        const membershipPromo = model.get('promo')
        if (
          membershipPromo.SourceCodeMapping
          && (!membershipPromo.StripeOrg || membershipPromo.StripeOrg === 'ACORN')
        ) {
          type = true
          this.model.set({ membershipPromo }, { context: this })
        } else {
          // message = this.i18n.t('PROMOCODE-ERROR')
          message = '"Gift Code" provided. Please redeem with the Gift Code form'
        }
      }

      this.promoView.updatePromoMessage($('#apply-promo-code'), message, type)
      console.log(this.model.attributes)
    })

    this.listenTo(this.model, 'change:membershipPromo', (model, value, options1) => {
      console.log(model, value, options1)
      // debugger
      let isMonthlyPromoCode = true
      if (value) {
        // New promo code requirement test
        if (value.PlanTermRequirement && value.PlanTermRequirement === 'ANNUAL') {
          // debugger
          isMonthlyPromoCode = false
        }
      }

      if (isMonthlyPromoCode || !value) {
        // debugger
        this.cart.trigger('cart:promoCodeApplied', value, 'monthly', options1)
      }
    })

    this.listenTo(this.cart, 'change:monthly', (model, value) => {
      console.log(model, value)
      // debugger
      this.updateMonthlyPricing(value)
    })

    this.render()
  }

  render() {
    console.log('MembershipSelectionsMonthly render')
    const monthlyAmount = this.model.get('monthlyStripePlan').SubscriptionAmount
    const monthlyPlanPrice = this.parentView.applyPromoPrice([
      this.model.get('monthlyStripePlan').CurrencyDesc,
      this.model.get('monthlyStripePlan').CurrSymbol,
      this.model.get('monthlyStripePlan').SubscriptionAmount,
    ].join(''), 'monthly')
    const monthlyPlanID = this.model.get('monthlyStripePlan').PlanID

    const attributes = {
      monthlyAmount,
      monthlyPlanID,
      monthlyPlanPrice,
    }
    const html = this.template(attributes)
    this.$el.append(html)

    this.parentView.selectDefaultPlan()

    this.setPresetOptions()

    return this
  }

  /*
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
  */

  /*
  selectDefaultPlan() {
    const isMembershipActive = (this.model.has('Membership')
      && this.model.get('Membership').Status === 'ACTIVE')
    const isMembershipType = (this.model.has('Subscription')
      && this.model.get('Subscription').Type)
    const planID = this.model.get('monthlyStripePlan').PlanID
    this.membershipType = 'monthly'
    this.planID = planID
    if (isMembershipActive && isMembershipType) {
      if (this.model.get('Subscription').Type.toUpperCase() === 'ANNUAL') {
        this.membershipType = 'annual'
        this.planID = this.model.get('annualStripePlan').PlanID
      }
    }

    //  If we already have annual membership in the cart from `/#give` page
    if (this.cart.has('annual')) {
      if (this.cart.get('annual').quantity > 0) {
        this.membershipType = 'annual'
        this.planID = this.model.get('annualStripePlan').PlanID
      }
    }

    this.$(`input[type="radio"][value="${this.membershipType}"]`).prop('checked', true)
    this.model.set({
      currentPlanID: this.planID,
    })

    this.updateCart()
  }
  */

  updateMembershipPlan(e) {
    console.log('MembershipSelectionsMonthly updateMembershipPlan')
    e.preventDefault()
    console.log(e.target.value)
    this.membershipType = e.target.value
    // debugger
    this.$(`input[type="radio"][value="${this.membershipType}"]`).prop('checked', true)

    const currentPlanID = this.model.get(`${this.membershipType}StripePlan`).PlanID
    this.model.set({ currentPlanID })

    if (this.model.has('membershipPromo') || $('#promo-code').val()) {
      const promoCode = this.model.has('membershipPromo')
        ? this.model.get('membershipPromo').PromotionCode
        : $('#promo-code').val()
      const data = {
        Code: promoCode,
        Country: this.model.get('stripePlansCountry'),
        CustomerID: (this.model.has('Customer') && this.model.get('Customer').CustomerID) || '',
        PlanID: this.model.get('currentPlanID'),
      }
      // debugger
      console.log(data)
      this.promoValidateModel.submit(data)
    }

    this.parentView.updateCart(this.membershipType)
  }

  /*
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
  */

  updateMonthlyPricing(cart) {
    const {
      amount,
      // quantity,
      // total,
    } = cart
    if (this.model.has('membershipPromo')) {
      if (amount !== this.model.get('monthlyStripePlan').SubscriptionAmount) {
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
            `${this.model.get('stripePlansLang')}-IN`,
            {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
              trailingZeroDisplay: 'stripIfInteger',
            },
          ).format(amount),
        ].join('')

        const oldPricingContainer = $('<del>').append($('<span>').addClass('old-pricing').html(oldPricing))
        const newPricingContainer = $('<span>').html(newPricing).append(oldPricingContainer)

        // this.$('.annual-plan-message span').addClass('applied-success').html(pricing)
        // this.$('#billing-container .legal-notice span').html(pricing)
        // this.$('.plan.monthly .h4 span').replaceWith(newPricingContainer)
        this.$('.h4 span').replaceWith(newPricingContainer)
      }
    } else {
      this.resetMonthlyPricing()
    }
  }

  resetMonthlyPricing() {
    console.log('MembershipSelectionsMonthly resetMonthlyPricing')
    // const monthlyPlanContainer = this.$('.plan.monthly')
    const monthlyPlanContainer = this.$el
    const monthlyAmount = [
      this.model.get('monthlyStripePlan').CurrencyDesc,
      this.model.get('monthlyStripePlan').CurrSymbol,
      this.model.get('monthlyStripePlan').SubscriptionAmount,
    ].join('')

    monthlyPlanContainer
      .find('span')
      .html(monthlyAmount)
  }

  setPresetOptions() {
    console.log('MembershipSelectionsMonthly setPresetOptions')
    this.promoView.setPresetOptions(this.$el, 'plan', 'monthly')
  }
}

export default MembershipSelectionsMonthly
