import { View } from 'backbone'
// import _ from 'underscore'

import './stylesheet.css'
import StripeForm from 'shared/stripe-form'
import template from './index.hbs'

import ConfirmBillingModel from './model'

class ConfirmBilling extends View {
  get el() {
    return '#account'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click a.cc-edit': 'editCreditCard',
    }
  }

  initialize(options) {
    console.log('ConfirmBilling initialize')
    console.log(this, options.switchToAnnualPlan)
    this.switchToAnnualPlan = options.switchToAnnualPlan
    this.model = new ConfirmBillingModel(this.switchToAnnualPlan.model.attributes)
    console.log(this.model)

    this.listenTo(this.model, 'sync', this.render)
  }

  render() {
    console.log('ConfirmBilling render')
    // console.log(this.$el[0])
    // console.log(this.$el.find('.switch-to-annual-plan-container')[0])
    // console.log(this.$el.find('#confirm-billing')[0])
    // console.log(this.model.attributes)

    if (this.model.has('newStripeCardInfo')) {
      this.model.updateCurrentBillingInfo()
    }
    this.getConfirmCurrentBillingInfo()

    const data = this.getTemplateData()
    // console.log(data)
    const html = this.template(data)
    // console.log(html)
    this.$el.find('#confirm-billing').empty().append(html)
    // this.$el.html(html)

    this.switchToAnnualPlan.model.set('promoCodeFieldDisplay', true)
  }

  editCreditCard(e) {
    console.log('ConfirmBilling editCreditCard')
    e.preventDefault()
    this.switchToAnnualPlan.model.set('promoCodeFieldDisplay', false)
    // console.log(this.$el[0])
    // console.log(this.$el.find('#confirm-billing')[0])
    this.$el.find('#confirm-billing').empty()
    this.stripeForm = new StripeForm({ parentView: this })
    this.stripeForm.render()
  }

  getConfirmCurrentBillingInfo() {
    console.log('ConfirmBilling getConfirmCurrentBillingInfo')
    const currentBillingInfo = this.model.get('currentBillingInfo')
    // console.log(this, currentBillingInfo)
    this.switchToAnnualPlan.model.set('currentBillingInfo', currentBillingInfo)
  }

  getTemplateData() {
    console.log('ConfirmBilling getTemplateData')
    const ccLast4 = this.model.has('newStripeCardInfo')
      ? this.model.get('newStripeCardInfo').last4
      : this.model.get('stripeCardInfo').last4
    const ccNameOnCard = this.model.has('newStripeCardInfo')
      ? this.model.get('newStripeCardInfo').name
      : this.model.get('stripeCardInfo').name
    const ccExpiration = this.model.get('fullCardExpiry')
    // console.log(this.model)
    return {
      ccLast4,
      ccNameOnCard,
      ccExpiration,
    }
  }
}

export default ConfirmBilling
