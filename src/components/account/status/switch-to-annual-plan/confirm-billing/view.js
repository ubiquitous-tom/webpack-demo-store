import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.css'
import template from './index.hbs'

import StripeForm from 'shared/stripe-form'

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
    // console.log(this, options.parent)
    this.model = options.parent
  }

  render() {
    console.log('ConfirmBilling render')
    // console.log(this.$el[0])
    // console.log(this.$el.find('.switch-to-annual-plan-container')[0])
    // console.log(this.$el.find('#confirm-billing')[0])
    const html = this.template(this.model.attributes)
    // console.log(html)

    this.$el.find('#confirm-billing').empty().append(html)
  }

  editCreditCard(e) {
    e.preventDefault()
    // console.log(this.$el[0])
    // console.log(this.$el.find('#confirm-billing')[0])
    this.$el.find('#confirm-billing').empty()
    this.stripeForm = new StripeForm({ parent: this })
    console.log(this.stripeForm)
    this.stripeForm.render()
  }
}

export default ConfirmBilling
