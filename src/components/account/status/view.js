import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.css'
import template from './temp-new.html'
import MonthlyPlan from './monthly-plan'
import AnnualPlan from './annual-plan'
import AccountStatusModel from './model'
// import Dispatcher from 'common/dispatcher'
// import ATVView from 'common/view'

class AccountStatus extends View {

  get el() {
    return 'section'
  }

  get template() {
    return _.template(template)
  }

  initialize(options) {
    console.log('AccountStatus initialize')
    this.dispatcher = options.dispatcher
    // console.log(this.model.attributes)
    this.model = new AccountStatusModel(this.model.attributes)
    this.listenTo(this.model, 'sync', this.render)
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
      this.monthlyPlan = new MonthlyPlan({ model: this.model, dispatcher: this.dispatcher })
    } else {
      console.log('AccountStatus annualPlan render')
      this.annualPlan = new AnnualPlan({ model: this.model, dispatcher: this.dispatcher })
    }
  }
}

export default AccountStatus
