import { View } from 'backbone'
// import _ from 'underscore'
// import Handlebars from 'handlebars'

import './stylesheet.scss'
import placeholder from './placeholder.hbs'
import template from './index.hbs'
import AnnualPlanModel from './model'
import SwitchToMonthlyPlan from '../switch-to-monthly-plan'

class AnnualPlan extends View {
  get el() {
    return 'section'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click .switch-to-monthly': 'switchToMonthly',
    }
  }

  initialize() {
    console.log('AnnualPlan initialize')
    console.log(this)
    this.model = new AnnualPlanModel(this.model.attributes)
    // console.log(this.model)
    // console.log(this.model.attributes)
    if (this.model.has('monthlyStripePlan')) {
      this.render()
    } else {
      this.contentPlaceholder()
    }

    this.listenTo(this.model, 'change:monthlyStripePlan', this.render)
  }

  render() {
    console.log('AnnualPlan render')
    // const template = Handlebars.compile(this.template())
    console.log(this.model.attributes)
    const data = {
      renewalDate: this.model.get('renewalDate'),
      currSymbol: this.model.get('Customer').CurrSymbol,
      subscriptionAmount: this.getCurrentNetAmount(),
      annualPerMonthPricing: this.model.get('annualPerMonthPricing'),
      monthlySubscriptionAmount: this.model.get('monthlyStripePlan').SubscriptionAmount,
      tagline: this.getTagline(),
    }
    const html = this.template(data)
    // console.log(html)
    // console.log(this.$el.find('.current-plan'))
    this.$el.find('.current-plan').html(html)

    // this.$el.html(html)
    // this.$el.html(this.template(this.model.attributes))
    return this
  }

  contentPlaceholder() {
    console.log('AnnualPlan contentPlaceholder')
    this.$el.find('.current-plan').html(placeholder)
  }

  switchToMonthly(e) {
    e.preventDefault()
    console.log('AnnualPlan switchToMonthly')
    // console.log(this.switchToMonthlyPlan)
    this.switchToMonthlyPlan = new SwitchToMonthlyPlan({ model: this.model })
    this.switchToMonthlyPlan.render()
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
    //     : this.getCurrentNetAmount()
  }

  getTagline() {
    if (this.model.get('Subscription').Promo) {
      return this.getPromoCodeInfo()
    }
    return this.getAnnualDiscount()
  }

  getPromoCodeInfo() {
    return `with promo code - ${this.model.get('Membership').PromoCode}`
  }

  getAnnualDiscount() {
    return `That's only ${this.model.get('Customer').CurrSymbol} ${this.model.get('annualPerMonthPricing')}/mo!`
  }
}

export default AnnualPlan
