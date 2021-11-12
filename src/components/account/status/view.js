import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.css'
import template from './temp-new.html'
import MonthlyPlan from './monthly-plan'
import AnnualPlan from './annual-plan'
import SwitchToMonthlyPlan from './switch-to-monthly-plan'
// import SwitchToAnnualPlan from './switch-to-annual-plan'
// import { getLocalStorage } from 'backbone.localstorage/src/utils'
import AccountStatusModel from './model'

class AccountStatus extends View {

  get template() {
    console.log('AccountStatus template')
    return _.template(template)
  }

  get events() {
    return {
      'click .switch-to-monthly': 'switchToMonthly',
      // 'click .switch-to-annual': 'switchToAnnual',
    }
  }

  initialize() {
    console.log('AccountStatus initialize')
    this.currentPlan = 'annual'
    // this.currentPlan = 'monthly'
    this.model = new AccountStatusModel()
    this.subscription = this.model.get('Subscription')
    // this.membership = this.model.get('Membership')
    // this.getCurrentPlan()
    console.log(this.subscription)
    // this.listenTo(this, 'change update', this.getCurrentTemplate)
  }

  render() {
    console.log('AccountStatus render')
    this.$el.html(this.template())
    console.log(this.model.attributes)
    this.getCurrentTemplate()
  }

  switchToMonthly(e) {
    e.preventDefault()
    console.log('switch to monthly plan')
    // console.log(this.switchToMonthlyPlan)
    this.switchToMonthlyPlan.render()
  }

  // switchToAnnual(e) {
  //   e.preventDefault()
  //   console.log('switch to annual plan')
  //   // console.log(this.switchToAnnualPlan)
  //   this.switchToAnnualPlan.render()
  // }

  getCurrentTemplate() {
    console.log('AccountStatus getCurrentTemplate')
    console.log(this.subscription)
    // console.log(this.template(data))
    // console.log(this.$el.find('.current-plan')[0])

    if (_.isEmpty(this.subscription)) {
      return
    }

    if (this.subscription.Monthly) {
      console.log('AccountStatus monthlyPlan render')
      this.monthlyPlan = new MonthlyPlan({ model: this.model })
      // this.switchToAnnualPlan = new SwitchToAnnualPlan({ model: this.model })
      // this.monthlyPlan.render()
    } else {
      console.log('AccountStatus annualPlan render')
      this.annualPlan = new AnnualPlan({ model: this.model })
      this.switchToMonthlyPlan = new SwitchToMonthlyPlan({ model: this.model })
      this.annualPlan.render()
    }
  }
}

export default AccountStatus
