import { View } from 'backbone'
// import _ from 'underscore'

import FlashMessage from 'shared/elements/flash-message'
import './stylesheet.scss'
import placeholder from './placeholder.hbs'
import template from './index.hbs'
import GuestPlanModel from './model'

class GuestPlan extends View {
  get el() {
    return '.current-plan'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click button.start-free-trial': 'startFreeTrial',
    }
  }

  initialize(options) {
    console.log('GuestPlan initialize')
    console.log(this)
    this.flashMessage = new FlashMessage()
    this.i18n = options.i18n
    this.model = new GuestPlanModel(this.model.attributes)
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
    console.log('GuestPlan render')
    // console.log(template)
    console.log(this.model.attributes)
    const data = {
      currSymbol: this.model.get('monthlyStripePlan').CurrSymbol,
      monthlySubscriptionAmount: this.model.annualPerMonthPricing(),
      trialDays: this.model.get('monthlyStripePlan').TrialDays,
      annualSubscriptionAmount: this.model.get('annualStripePlan').SubscriptionAmount,
    }
    const html = this.template(data)
    this.$el.html(html)

    this.startFreeTrialBanner()

    return this
  }

  contentPlaceholder() {
    this.$el.html(placeholder)
  }

  startFreeTrialBanner() {
    // const message = `
    // Start streaming now! Try ${this.model.get('monthlyStripePlan').TrialDays} Days Free
    // `
    const message = this.i18n.t('START-STREAMING-NOW-TRY-NUMBERS-DAY-FREE-WITH-LINK', {
      url: `${this.model.get('signinEnv')}/trialsignup.jsp?OperationalScenario=STORE`,
      trialDays: this.model.get('monthlyStripePlan').TrialDays,
    })
    const type = 'success'
    this.flashMessage.onFlashMessageShow(message, type)
  }

  startFreeTrial(e) {
    e.preventDefault()
    const startFreeTrialURL = `${this.model.get('signinEnv')}/trialsignup.jsp?OperationalScenario=STORE`
    console.log(startFreeTrialURL)
    window.location.assign(startFreeTrialURL)
  }
}

export default GuestPlan
