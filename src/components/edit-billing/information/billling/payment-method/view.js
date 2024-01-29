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
    this.tempPaymentInfo = {}

    this.listenToOnce(this.model, 'editBillingValidation:paymentMethod', (paymentInfo, context) => {
      console.log(paymentInfo, context)
      this.tempPaymentInfo = paymentInfo
      // debugger
      this.$el.find('#nameoncard').focus().blur()
      this.stripeForm.generateToken()
    })

    this.listenToOnce(this.model, 'change:stripeCardTokenID', (model, value, options) => {
      console.log(model, value, options)
      const { context } = options
      // debugger
      if (
        !_.isEmpty(this.$el.find('#nameoncard').val())
        && this.$el.find('#nameoncard')[0].checkValidity()
      ) {
        if (value) {
          let paymentInfo = this.tempPaymentInfo // model.get('paymentInfo')
          const paymentMethod = {
            PaymentMethod: {
              NameOnAccount: this.$el.find('#nameoncard').val().trim(),
              StripeToken: value,
            },
          }
          paymentInfo = { ...paymentInfo, ...paymentMethod }
          // debugger
          // model.set({
          //   paymentInfo,
          // })
          // debugger
          this.model.trigger('editBillingValidation:stripeCardToken', paymentInfo, context)
        }
      } else {
        this.$el.find('#nameoncard').parent('.form-group').removeClass('has-success').addClass('has-error')
      }
    })

    this.render()
  }

  render() {
    console.log('EditBillingInformationBillingPaymentMethod render')
    console.log(this.model.attributes)
    const html = this.template()
    this.$el.html(html)

    // this.stripeForm.contentPlaceholder()

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
