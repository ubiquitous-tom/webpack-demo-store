import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.css'
import template from './temp-new.html'
import MonthlyPlan from './monthly-plan'
import AnnualPlan from './annual-plan'
import AccountStatusModel from './model'
import GuestPlan from './guest-plan'
// import ATVView from 'common/view'

class AccountStatus extends View {
  get el() {
    return 'section'
  }

  get template() {
    return _.template(template)
  }

  initialize() {
    console.log('AccountStatus initialize')
    // console.log(this.model.attributes)
    this.model = new AccountStatusModel(this.model.attributes)
    // this.listenTo(this.model, 'change:plansAvailableSuccess', this.render)
    this.render()
  }

  render() {
    console.log('AccountStatus render')
    // console.log(this.$el[0], this.$el.find('#accountStatusView')[0])
    this.$el.find('#accountStatusView').html(this.template())

    this.getCurrentTemplate()

    return this
  }

  getCurrentTemplate() {
    console.log('AccountStatus getCurrentTemplate')
    // console.log(this.model.has('Subscription'), this.model.get('Subscription'))
    if (!this.model.has('Subscription')) {
      return
    }

    if (this.model.get('Subscription').Monthly) {
      console.log('AccountStatus monthlyPlan render')
      this.monthlyPlan = new MonthlyPlan({ model: this.model })
    }

    if (this.model.get('Subscription').Annual) {
      console.log('AccountStatus annualPlan render')
      this.annualPlan = new AnnualPlan({ model: this.model })
    }

    if (this.model.get('Subscription').NoSubscription) {
      console.log('AccountStatus guestPlan render')
      this.guestPlan = new GuestPlan({ model: this.model })
    }
  }
}

export default AccountStatus
