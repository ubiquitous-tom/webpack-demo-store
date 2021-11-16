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

  get el() {
    return 'section'
  }

  get template() {
    // console.log('AccountStatus template')
    return _.template(template)
  }

  get events() {
    return {
      'click .switch-to-monthly': 'switchToMonthly',
      // 'click .switch-to-annual': 'switchToAnnual',
    }
  }

  initialize(options) {
    console.log('AccountStatus initialize')
    // console.log(this.model.attributes)
    this.model = new AccountStatusModel(this.model.attributes)
    console.log(this.model.get('Subscription'))
    this.subscription = this.model.get('Subscription')
    // this.membership = this.model.get('Membership')
    // this.getCurrentPlan()
    // console.log(this.subscription)
    // this.listenTo(this.model, 'change', this.getCurrentTemplate())
    this.listenTo(this.model, 'sync', this.render)
    // this.getCurrentTemplate()
    // this.render()
  }

  render() {
    console.log('AccountStatus render')
    // console.log(this.$el[0], this.$el.find('#accountStatusView')[0])
    this.$el.find('#accountStatusView').html(this.template())
    // console.log(this.model.attributes)
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
