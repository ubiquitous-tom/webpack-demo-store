import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.css'
import template from './index.hbs'

import Dispatcher from 'common/dispatcher'
import StripeForm from 'shared/stripe-form'
import ConfirmBillingModel from './model'
// import ATVView from 'common/view'

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
    console.log(this, options.switchToAnnualPlanModel)
    this.options = options
    // this.model = options.switchToAnnualPlanModel
    // const stripeCustomerID = options.switchToAnnualPlanModel.get('Customer').StripeCustomerID
    // this.model = new ConfirmBillingModel({ stripeCustomerID: stripeCustomerID })
    console.log(options.dispatcher)
    this.dispatcher = options.dispatcher
    this.model = new ConfirmBillingModel(options.switchToAnnualPlanModel.attributes)
    console.log(this.model)

    // this.stripeForm = new StripeForm({ parentView: this })
    // console.log(this.stripeForm)
    this.listenTo(this.model, 'sync', this.render)
  }

  render() {
    console.log('ConfirmBilling render')
    // console.log(this.$el[0])
    // console.log(this.$el.find('.switch-to-annual-plan-container')[0])
    // console.log(this.$el.find('#confirm-billing')[0])
    // console.log(this.model.attributes.stripeCardInfo)
    // console.log(this.model.attributes)
    // console.log(this.model.get('stripeCardInfo'))

    if (this.model.has('newStripeCardInfo')) {
      this.model.updateCurrentBillingInfo()
    }
    this.getConfirmCurrentBillingInfo()

    const data = this.getTemplateData()
    console.log(data)
    const html = this.template(data)
    // console.log(html)
    this.$el.find('#confirm-billing').empty().append(html)
    // this.$el.html(html)

    this.dispatcher.trigger('promoCode:show', this)
  }

  editCreditCard(e) {
    console.log('ConfirmBilling editCreditCard')
    e.preventDefault()
    this.dispatcher.trigger('promoCode:hide', this)
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
    this.options.switchToAnnualPlanModel.set('currentBillingInfo', currentBillingInfo)
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
      ccLast4: ccLast4,
      ccNameOnCard: ccNameOnCard,
      ccExpiration: ccExpiration,
    }
  }
}

export default ConfirmBilling
