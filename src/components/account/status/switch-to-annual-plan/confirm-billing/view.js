import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.css'
import template from './index.hbs'

import StripeForm from 'shared/stripe-form'
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
    console.log(this, options.switchToAnnualPlanModel)
    // this.model = options.switchToAnnualPlanModel
    // const stripeCustomerID = options.switchToAnnualPlanModel.get('Customer').StripeCustomerID
    // this.model = new ConfirmBillingModel({ stripeCustomerID: stripeCustomerID })
    this.model = new ConfirmBillingModel({ switchToAnnualPlanModel: options.switchToAnnualPlanModel })
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

    const newCurrentBillingInfo = this.model.get('currentBillingInfo')
    console.log(this, this.model.get('currentBillingInfo'))

    if (this.model.has('newStripeCardInfo')) {
      this.model.updateCurrentBillingInfo()
    }

    const ccLast4 = this.model.has('newStripeCardInfo')
      ? this.model.get('newStripeCardInfo').last4
      : this.model.get('stripeCardInfo').last4
    const ccNameOnCard = this.model.has('newStripeCardInfo')
      ? this.model.get('newStripeCardInfo').name
      : this.model.get('stripeCardInfo').name
    const ccExpiration = this.model.get('fullCardExpiry')



    console.log(this.model)
    const cardInfo = {
      ccLast4: ccLast4,
      ccNameOnCard: ccNameOnCard,
      ccExpiration: ccExpiration,
    }
    console.log(cardInfo)
    const html = this.template(cardInfo)
    // console.log(html)

    this.$el.find('#confirm-billing').empty().append(html)
    // this.$el.html(html)
  }

  editCreditCard(e) {
    e.preventDefault()
    // console.log(this.$el[0])
    // console.log(this.$el.find('#confirm-billing')[0])
    this.$el.find('#confirm-billing').empty()
    this.stripeForm = new StripeForm({ parentView: this })
    this.stripeForm.render()
  }

  // getCurrentBillingInfo() {
  //   const currentBillingInfo = {
  //     name: options.switchToAnnualPlanModel.get('Customer').Name,
  //     // email: options.switchToAnnualPlanModel.get('Customer').Email,
  //     // last4: ...
  //     zipcode: options.switchToAnnualPlanModel.get('BillingAddress').PostalCode,
  //     country: options.switchToAnnualPlanModel.get('BillingAddress').Country,
  //     StripeCustomerID: options.switchToAnnualPlanModel.get('Customer').StripeCustomerID
  //   }
  //   this.model.set('currentBillingInfo', currentBillingInfo)
  // }

  // updateCurrentBillingInfo() {

  // }
}

export default ConfirmBilling
