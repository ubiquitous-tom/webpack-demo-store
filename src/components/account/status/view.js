import { View } from 'backbone'

import './stylesheet.css'
import template from './index.hbs'
import MonthlyPlan from './monthly-plan'
import AnnualPlan from './annual-plan'
import AccountStatusModel from './model'
import GuestPlan from './guest-plan'

class AccountStatus extends View {
  get el() {
    return 'section'
  }

  get template() {
    return template
  }

  initialize(options) {
    console.log('AccountStatus initialize')
    this.i18n = options.i18n
    this.model = new AccountStatusModel(this.model.attributes)
    this.render()
  }

  render() {
    console.log('AccountStatus render')
    this.$el.find('#accountStatusView').html(this.template())

    this.getCurrentTemplate()

    return this
  }

  getCurrentTemplate() {
    console.log('AccountStatus getCurrentTemplate')
    if (!this.model.has('Subscription')) {
      return
    }

    if (this.model.get('Subscription').Monthly) {
      console.log('AccountStatus monthlyPlan render')
      this.monthlyPlan = new MonthlyPlan({ model: this.model, i18n: this.i18n })
    }

    if (this.model.get('Subscription').Annual) {
      console.log('AccountStatus annualPlan render')
      this.annualPlan = new AnnualPlan({ model: this.model, i18n: this.i18n })
    }

    if (this.model.get('Subscription').NoSubscription) {
      console.log('AccountStatus guestPlan render')
      this.guestPlan = new GuestPlan({ model: this.model, i18n: this.i18n })
    }
  }
}

export default AccountStatus
