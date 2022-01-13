import { View } from 'backbone'

import './stylesheet.scss'
import FlashMessage from 'shared/elements/flash-message'
import placeholder from './placeholder.hbs'
import template from './index.hbs'
import AnnualPlanModel from '../annual-plan/model'
// import SwitchToMonthlyPlan from '../switch-to-monthly-plan'

class CanceledPlan extends View {
  get el() {
    return 'section'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click button#restartMembership': 'restartMembership',
    }
  }

  initialize(options) {
    console.log('CanceledPlan initialize')
    this.flashMessage = new FlashMessage()
    this.i18n = options.i18n
    this.model = new AnnualPlanModel(this.model.attributes)
    if (this.model.has('monthlyStripePlan')) {
      this.render()
    } else {
      this.contentPlaceholder()
    }

    this.listenTo(this.model, 'change:monthlyStripePlan', this.render)
  }

  render() {
    console.log('CanceledPlan render')
    const data = {
      annual: this.model.get('Subscription').Annual,
      planType: this.getPlanType(),
      cancelledDate: this.model.get('Membership').CancelDate,
      currSymbol: this.model.get('monthlyStripePlan').CurrSymbol,
      subscriptionAmount: this.getCurrentNetAmount(),
      termType: this.getTermType(),
      annualPerMonthPricing: this.model.get('annualPerMonthPricing'),
      monthlySubscriptionAmount: this.model.get('monthlyStripePlan').SubscriptionAmount,
      tagline: this.getTagline(),
    }
    const html = this.template(data)
    this.$el.find('.current-plan').html(html)

    this.restartNowBanner()

    return this
  }

  contentPlaceholder() {
    console.log('CanceledPlan contentPlaceholder')
    this.$el.find('.current-plan').html(placeholder)
  }

  restartMembership(e) {
    console.log('CanceledPlan restartMembership')
    e.preventDefault()
    const startFreeTrialURL = `${this.model.get('signinEnv')}/trialsignup.jsp?OperationalScenario=STORE`
    console.log(startFreeTrialURL)
    window.location.assign(startFreeTrialURL)
  }

  getCurrentNetAmount() {
    if (this.model.get('Membership').NetAmount) {
      return this.model.get('Membership').NetAmount
    }
    if (this.model.get('Membership').NextBillingAmount) {
      return this.model.get('Membership').NextBillingAmount
    }
    return this.model.get('Membership').SubscriptionAmount
  }

  getTagline() {
    // return `you can stream until ${this.model.get('Membership').ExpirationDate}.`
    return this.i18n.t('YOU-CAN-STREAM-UNTIL-DATE', { expirationDate: this.model.get('Membership').ExpirationDate })
  }

  getPlanType() {
    return (this.model.get('Subscription').Annual) ? this.i18n.t('ANNUAL') : this.i18n.t('MONTHLY')
  }

  getTermType() {
    return (this.model.get('Subscription').Annual) ? this.i18n.t('YR') : this.i18n.t('MO')
  }

  restartNowBanner() {
    // const message = this.i18n.t('PLAN-TYPE-WAS-CANCELED-DATE-RESTART-NOW', {
    //   cancelledDate: this.model.get('Membership').CancelDate,
    // })
    const message = `Your membership was cancelled on ${this.model.get('Membership').CancelDate}. RESTART NOW`
    const type = 'error'

    this.flashMessage.onFlashMessageShow(message, type)
  }
}

export default CanceledPlan
