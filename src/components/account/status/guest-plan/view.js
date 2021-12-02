import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import template from './index.hbs'
import GuestPlanModel from './model'

class GuestPlan extends View {

  get el() {
    return 'section'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click button.start-free-trial': 'startFreeTrial',
    }
  }

  initialize() {
    console.log('GuestPlan initialize')
    console.log(this)
    this.model = new GuestPlanModel(this.model.attributes)
    // console.log(this.model)
    // console.log(this.model.attributes)
    this.render()
  }

  render() {
    console.log('GuestPlan render')
    // console.log(template)
    console.log(this.model.attributes)
    const data = {
      currSymbol: this.model.get('monthlyStripePlan').CurrSymbol,
      monthlySubscriptionAmount: this.model.get('monthlyStripePlan').SubscriptionAmount,
      trialDays: this.model.get('monthlyStripePlan').TrialDays,
    }
    const html = this.template(data)
    this.$el.find('.current-plan').html(html)
    // this.$el.html(this.template)

    return this
  }

  startFreeTrial(e) {
    e.preventDefault()
    const startFreeTrialURL = `${this.model.get('signinEnv')}/signin.jsp?OperationalScenario=STORE`
    console.log(startFreeTrialURL)
  }

}

export default GuestPlan
