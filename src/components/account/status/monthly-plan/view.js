import { View } from 'backbone'
// import _ from 'underscore'
// import Handlebars from 'handlebars'

import FlashMessage from 'shared/elements/flash-message'
import SwitchToAnnualPlan from '../switch-to-annual-plan'

import './stylesheet.scss'
import template from './index.hbs'
import MonthlyPlanModel from './model'
// import AccountStatusModel from '../model'

class MonthlyPlan extends View {
  get el() {
    return 'section'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click .switch-to-annual': 'switchToAnnual',
    }
  }

  initialize(options) {
    console.log('MonthlyPlan initialize')
    console.log(this, options)
    this.model = new MonthlyPlanModel(this.model.attributes)
    // this.getRenewalDate()
    console.log(this)
    this.render()
  }

  render() {
    console.log('MonthlyPlan render')
    // const template = Handlebars.compile(this.template())
    // console.log(template)
    const data = {
      renewalDate: this.model.get('renewalDate'),
      currSymbol: this.model.get('Customer').CurrSymbol,
      subscriptionAmount: this.getCurrentNetAmount(),
      annualSubscriptionAmount: this.model.get('annualStripePlan').SubscriptionAmount,
      tagline: this.getTagline(),
    }
    const html = this.template(data)
    this.$el.find('.current-plan').html(html)
    // this.$el.html(this.template)

    return this
  }

  switchToAnnual(e) {
    e.preventDefault()
    console.log('switch to annual plan')
    // console.log(this.switchToAnnualPlan)
    this.switchToAnnualPlan = new SwitchToAnnualPlan({
      monthlyPlan: this.model,
    })
    // this.switchToAnnualPlan.render()
  }

  getCurrentNetAmount() {
    if (this.model.get('Membership').NetAmount) {
      return this.model.get('Membership').NetAmount
    }
    if (this.model.get('Membership').NextBillingAmount) {
      return this.model.get('Membership').NextBillingAmount
    }
    return this.model.get('Membership').SubscriptionAmount
    // return this.model.get('Membership').NetAmount
    //   ? this.model.get('Membership').NetAmount
    //   : this.model.get('Membership').NextBillingAmount
    //     ? this.model.get('Membership').NextBillingAmount
    //     : this.model.get('Membership').SubscriptionAmount
  }

  getTagline() {
    if (this.model.get('Subscription').Promo) {
      return this.getPromoCodeInfo()
    }

    if (this.model.get('Subscription').Trial) {
      return this.getTrialInfo()
    }

    return ''
  }

  getPromoCodeInfo() {
    return `with promo code - ${this.model.get('Membership').PromoCode}`
  }

  getTrialInfo() {
    const message = `Your free trial starts now and ends on ${this.model.get('trialEndDate')}`
    const type = 'success'

    this.flashMessage = new FlashMessage()
    this.flashMessage.onFlashMessageShow(message, type)

    return 'after your free trial ends.'
  }
}

export default MonthlyPlan
