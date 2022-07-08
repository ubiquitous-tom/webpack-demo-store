import { View } from 'backbone'
// import _ from 'underscore'

import './stylesheet.scss'
import StripeForm from 'shared/stripe-form'
import template from './index.hbs'

import ConfirmNewBillingModel from './model'

class ConfirmNewBilling extends View {
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
    console.log('ConfirmNewBilling initialize')
    console.log(this, options.updateCard)
    this.i18n = options.i18n
    this.updateCard = options.updateCard
    this.model = new ConfirmNewBillingModel(this.updateCard.model.attributes)
    console.log(this.model)

    this.listenTo(this.model, 'sync', this.render)
  }

  render() {
    console.log('ConfirmNewBilling render')
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

    this.updateCard.model.set('promoCodeFieldDisplay', true)
  }

  editCreditCard(e) {
    console.log('ConfirmNewBilling editCreditCard')
    e.preventDefault()
    // this.updateCard.model.set('promoCodeFieldDisplay', false)
    // console.log(this.$el[0])
    // console.log(this.$el.find('#confirm-billing')[0])
    this.$el.find('#confirm-billing').empty()
    this.stripeForm = new StripeForm({ parentView: this, i18n: this.i18n })
    // this.stripeForm.render()
    this.stripeForm.contentPlaceholder()
  }

  getConfirmCurrentBillingInfo() {
    console.log('ConfirmNewBilling getConfirmCurrentBillingInfo')
    const currentBillingInfo = this.model.get('currentBillingInfo')
    // console.log(this, currentBillingInfo)
    this.updateCard.model.set('currentBillingInfo', currentBillingInfo)
  }

  getTemplateData() {
    console.log('ConfirmNewBilling getTemplateData')
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

export default ConfirmNewBilling
