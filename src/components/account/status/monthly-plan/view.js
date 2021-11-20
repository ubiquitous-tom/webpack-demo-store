import { View } from 'backbone'
import _ from 'underscore'
import Handlebars from 'handlebars'

import './stylesheet.scss'
import template from './index.html'
import MonthlyPlanModel from './model'
// import AccountStatusModel from '../model'
import SwitchToAnnualPlan from '../switch-to-annual-plan'

class MonthlyPlan extends View {

  get el() {
    return 'section'
  }

  get template() {
    return _.template(template)
  }

  get events() {
    return {
      'click .switch-to-annual': 'switchToAnnual',
    }
  }

  initialize(options) {
    console.log('MonthlyPlan initialize')
    console.log(this, options)
    // this.model = new AccountStatusModel()
    this.model = new MonthlyPlanModel(this.model.attributes)
    // this.getRenewalDate()
    console.log(this)
    this.render()
  }

  render() {
    console.log('MonthlyPlan render')
    const template = Handlebars.compile(this.template())
    // console.log(template)
    const data = {
      renewalDate: this.model.get('renewalDate'),
      currSymbol: this.model.get('Customer').CurrSymbol,
      subscriptionAmount: this.model.get('Membership').SubscriptionAmount,
      annualSubscriptionAmount: this.model.get('annualStripePlan').SubscriptionAmount,
    }
    const html = template(data)
    this.$el.find('.current-plan').html(html)
    // this.$el.html(this.template)

    return this
  }

  switchToAnnual(e) {
    e.preventDefault()
    console.log('switch to annual plan')
    // console.log(this.switchToAnnualPlan)
    this.switchToAnnualPlan = new SwitchToAnnualPlan({ monthlyPlan: this.model })
    // this.switchToAnnualPlan.render()
  }
}

export default MonthlyPlan
