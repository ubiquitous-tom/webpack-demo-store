import { View } from 'backbone'
import _ from 'underscore'

import Popup from 'shared/elements/popup'

import './stylesheet.scss'
import template from './index.hbs'

import StripeForm from './stripe-form'

class EditBillingInformationBillingPaymentMethod extends View {
  get el() {
    return '#paymentMethodContainer'
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

  initialize(options) {
    console.log('EditBillingInformationBillingPaymentMethod initialize')
    this.i18n = options.i18n

    this.popup = new Popup({ model: this, i18n: options.i18n })

    this.stripeForm = new StripeForm({ parentView: this, i18n: this.i18n })
    this.tempPaymentInfo = {}

    this.listenTo(this.model, 'editBilling:undelegateEvents', () => {
      console.log('EditBillingInformationBillingPaymentMethod garbageCollect')
      this.remove()
      // debugger
    })

    this.listenTo(this.model, 'editBillingValidation:paymentMethod', (paymentInfo) => {
      console.log(paymentInfo)
      this.tempPaymentInfo = paymentInfo
      // debugger
      const nameOnCardEl = this.$('#nameoncard')
      nameOnCardEl.focus().blur()
      // nameOnCardEl[0].checkValidity()
      if (_.isEmpty(nameOnCardEl.val()) || nameOnCardEl[0].validationMessage) {
        this.popup.render()
        this.popup.setBodyContent(this.i18n.t(nameOnCardEl.data('message')))
      } else {
        this.stripeForm.generateToken()
      }
    })

    /* eslint-disabled no-shadow: 0 */
    this.listenTo(this.model, 'change:stripeCardTokenID', (model, value) => {
      console.log(model, value)
      // debugger
      if (value) {
        let paymentInfo = this.tempPaymentInfo
        const paymentMethod = {
          PaymentMethod: {
            NameOnAccount: this.$('#nameoncard').val().trim(),
            StripeToken: value,
          },
        }
        paymentInfo = { ...paymentInfo, ...paymentMethod }
        // debugger
        this.model.trigger('editBillingValidation:stripeCardToken', paymentInfo)
      } else {
        this.popup.render()
        this.popup.setBodyContent(this.i18n.t('ENTER-VALID-CC'))
      }
    })

    this.listenTo(this.model, 'stripeCardTokenIDError', (error) => {
      console.log(error)
      // debugger
      this.popup.render()
      this.popup.setBodyContent(this.i18n.t('ENTER-VALID-CC'))
      this.model.trigger('editBillingValidation:formError', error)
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
    const el = this.$(`#${id}`)
    if (_.isEmpty(value) || validationMessage) {
      el.parent('.form-group').removeClass('has-success').addClass('has-error')
      this.popup.render()
      this.popup.setBodyContent(this.i18n.t(el.data('message')))
      isValidated = false
    } else {
      el.parent('.form-group').removeClass('has-error')
    }

    return isValidated
  }
}

export default EditBillingInformationBillingPaymentMethod
