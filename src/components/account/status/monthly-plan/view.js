import { View } from 'backbone'
import _ from 'underscore'
import Handlebars from 'handlebars'

import './stylesheet.css'
import template from './index.html'
import MonthlyPlanModel from './model'
// import AccountStatusModel from '../model'
import SwitchToAnnualPlan from '../switch-to-annual-plan'

class MonthlyPlan extends View {

  get template() {
    return _.template(template)
  }

  get events() {
    return {
      'click .switch-to-annual': 'switchToAnnual',
    }
  }

  initialize() {
    console.log('MonthlyPlan initialize')
    this.setElement('section')
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
    const html = template(this.model.attributes)
    // console.log(html)
    this.$el.find('.current-plan').html(html)
    // this.$el.html(this.template)

    return this
  }

  getRenewalDate() {
    console.log('MonthlyPlan getRenewal')
    // console.log(this)
    let date = new Date(this.model.get('Membership').NextBillingDateAsLong)
    let renewalDate = this.formatDate(date)
    // console.log(renewalDate)
    this.model.set('renewalDate', renewalDate)
  }

  switchToAnnual(e) {
    e.preventDefault()
    console.log('switch to annual plan')
    // console.log(this.switchToAnnualPlan)
    this.switchToAnnualPlan = new SwitchToAnnualPlan({ model: this.model })
    // this.switchToAnnualPlan.render()
  }
}

export default MonthlyPlan
