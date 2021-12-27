import { View } from 'backbone'

import './stylesheet.scss'
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
      currSymbol: this.model.get('Customer').CurrSymbol,
      subscriptionAmount: this.getCurrentNetAmount(),
      termType: this.getTermType(),
      annualPerMonthPricing: this.model.get('annualPerMonthPricing'),
      monthlySubscriptionAmount: this.model.get('monthlyStripePlan').SubscriptionAmount,
      tagline: this.getTagline(),
    }
    const html = this.template(data)
    this.$el.find('.current-plan').html(html)

    return this
  }

  contentPlaceholder() {
    console.log('CanceledPlan contentPlaceholder')
    this.$el.find('.current-plan').html(placeholder)
  }

  restartMembership(e) {
    console.log('CanceledPlan restartMembership')
    e.preventDefault()
    console.log('i do nothing')
    // console.log(this.switchToMonthlyPlan)
    // this.switchToMonthlyPlan = new SwitchToMonthlyPlan({ model: this.model })
    // this.switchToMonthlyPlan.render()
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
}

export default CanceledPlan
