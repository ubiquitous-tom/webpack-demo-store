import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import template from './index.hbs'

import StripeForm from './stripe-form'

class EditBillingInformationBillingPaymentMethod extends View {
  get el() {
    return 'form.form-trial-signup #paymentMethodContainer'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'input input#nameoncard': 'validate',
      'blur input#nameoncard': 'validate',
    }
  }

  initialize() {
    console.log('EditBillingInformationBillingPaymentMethod initialize')

    this.stripeForm = new StripeForm({ parentView: this, i18n: this.i18n })

    this.listenTo(this.model, 'editBillingValidation:paymentMethod', (model, context) => {
      console.log(model, context)
      debugger
      context.$el.find('#nameoncard').focus().blur()
      // if (context.$el.find('#nameoncard')[0].checkValidity()) {
      this.stripeForm.generateToken()
      // }
    })

    this.listenTo(this.model, 'change:newStripeCardInfo', (model, value) => {
      console.log(model, value)
      debugger
      if (
        _.isEmpty(this.$el.model.find('#nameoncard').val())
        && this.$el.model.find('#nameoncard')[0].checkValidity()
      ) {
        if (value) {
          const paymentInfo = model.get('paymentInfo')
          const paymentMethod = {
            PaymentMethod: {
              NameOnAccount: value.name,
              StripeToken: value.token,
            },
          }
          _.extend(paymentInfo, paymentMethod)
          debugger
          model.set(paymentMethod)
          debugger
          this.model.trigger('editBillingValidation:stripeCardInfo', value)
        }
      } else {
        this.$el.model.find('#nameoncard').parent('.form-group').removeClass('has-success').addClass('has-error')
      }
    })

    this.render()
  }

  render() {
    console.log('EditBillingInformationBillingPaymentMethod render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.html(html)

    this.stripeForm.contentPlaceholder()

    return this
  }

  validate(e) {
    const {
      id,
      value,
      validity,
      validationMessage,
    } = e.target
    console.log('validate', id, value, validity, validationMessage)
    let isValidated = true
    if (_.isEmpty(value) || validationMessage) {
      this.$el.find(`#${id}`).parent('.form-group').removeClass('has-success').addClass('has-error')
      isValidated = false
    } else {
      this.$el.find(`#${id}`).parent('.form-group').removeClass('has-error')
    }

    return isValidated
  }
}

export default EditBillingInformationBillingPaymentMethod
