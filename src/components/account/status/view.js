import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.css'
import template from './temp-new.html'
import MonthlyPlan from './monthly-plan'
import AnnualPlan from './annual-plan'
import AccountStatusModel from './model'

class AccountStatus extends View {

  get el() {
    return 'section'
  }

  get template() {
    return _.template(template)
  }

  initialize(options) {
    console.log('AccountStatus initialize')
    // console.log(this.model.attributes)
    this.model = new AccountStatusModel(this.model.attributes)
    // console.log(this.model.get('Subscription'))
    this.subscription = this.model.get('Subscription')
    // console.log(this.subscription)
    this.listenTo(this.model, 'sync', this.render)
  }

  render() {
    console.log('AccountStatus render')
    // console.log(this.$el[0], this.$el.find('#accountStatusView')[0])
    this.$el.find('#accountStatusView').html(this.template())
    // console.log(this.model.attributes)
    this.getCurrentTemplate()
  }

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
    } else {
      console.log('AccountStatus annualPlan render')
      this.annualPlan = new AnnualPlan({ model: this.model })
    }
  }
}

export default AccountStatus
