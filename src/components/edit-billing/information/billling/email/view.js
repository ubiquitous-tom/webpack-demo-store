import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import template from './index.hbs'

class EditBillingInformationBillingEmail extends View {
  get el() {
    return 'form.form-trial-signup #billingEmailContainer'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'input input#billingEmail': 'validateEmail',
      'blur input#billingEmail': 'validateEmail',
      'input input#billingEmailConfirm': 'validateEmail',
      'blur input#billingEmailConfirm': 'validateEmail',
      'input input#membershipPassword': 'validate',
      'blur input#membershipPassword': 'validate',
      'input input#membershipPasswordConfirm': 'validate',
      'blur input#membershipPasswordConfirm': 'validate',
    }
  }

  initialize() {
    console.log('EditBillingInformationBillingEmail initialize')
    this.cart = this.model.get('cart')

    this.listenTo(this.model, 'editBillingValidation:email', (paymentInfo, context) => {
      console.log(paymentInfo, context)
      // debugger
      // Customer is not logged in
      // which means `billingEmail input exists
      // sp we need to pass
      //
      // "Customer": {
      //   "Email": "toms23@test.com",
      //   "MarketingOptIn": "1",
      // },
      // "Credentials": {
      //   "Password": "tomtom",
      // },
      //
      // in `paymentInfo` object
      let paymentInfoNew = paymentInfo// model.get('paymentInfo')

      if (this.$el.find('#billingEmail').length) {
        // let paymentInfo = model.get('paymentInfo')
        const emailEl = this.$el.find('#billingEmail')
        const emailConfirmEl = this.$el.find('#billingEmailConfirm')
        const passwordEl = this.$el.find('#membershipPassword')
        const passwordConfirmEl = this.$el.find('#membershipPasswordConfirm')
        if (
          (emailEl[0].checkValidity() && this.validateEmailFormat(emailEl.val()))
          && (emailConfirmEl[0].checkValidity() && this.validateEmailFormat(emailConfirmEl.val()))
          && (emailEl.val().trim() === emailConfirmEl.val().trim())
        ) {
          const customer = {
            Customer: {
              Email: emailEl.val().trim(),
              MarketingOptIn: this.$el.find('#marketing-agree').val(),
            },
          }
          paymentInfoNew = { ...paymentInfoNew, ...customer }
        }

        if (
          passwordEl[0].checkValidity()
          && passwordConfirmEl[0].checkValidity()
          && (passwordEl.val().trim() === passwordConfirmEl.val().trim())
        ) {
          const credentials = {
            Credentials: {
              Password: passwordEl.val().trim(),
            },
          }
          paymentInfoNew = { ...paymentInfoNew, ...credentials }
        }
        // debugger
        // model.set({
        //   paymentInfo,
        // })
      }
      // debugger
      this.model.trigger('editBillingValidation:paymentMethod', paymentInfoNew, context)
    })

    const isLoggedIn = this.model.has('Subscription')
    if (!isLoggedIn) {
      this.email = ''
      if (this.model.has('Customer')) {
        this.email = this.model.get('Customer').Email
      }

      this.render()
    }
  }

  render() {
    console.log('EditBillingInformationBillingEmail render')
    console.log(this.model.attributes)
    const attributes = {
      email: this.email,
      membershipInCart: this.membershipInCart(),
    }
    const html = this.template(attributes)
    this.$el.html(html)

    return this
  }

  membershipInCart() {
    const isMonthly = this.cart.getItemQuantity('monthly')
    const isAnnual = this.cart.getItemQuantity('annual')
    return (isMonthly > 0 || isAnnual > 0)
  }

  validateEmail(e) {
    const { id, value } = e.target
    console.log('validate', id, value)
    let isValidated = true
    if (!this.validateEmailFormat(value)) {
      this.$el.find(`#${id}`).parent('.form-group').removeClass('has-success').addClass('has-error')
      isValidated = false
    } else {
      this.$el.find(`#${id}`).parent('.form-group').removeClass('has-error')
    }

    return isValidated
  }

  validate(e) {
    const { id, value } = e.target
    console.log('validate', id, value)
    let isValidated = true
    if (_.isEmpty(value)) {
      this.$el.find(`#${id}`).parent('.form-group').removeClass('has-success').addClass('has-error')
      isValidated = false
    } else {
      this.$el.find(`#${id}`).parent('.form-group').removeClass('has-error')
    }

    return isValidated
  }

  validateEmailFormat(email) {
    /* eslint no-control-regex: 0 */
    const emailValidation = /^((([a-z]|\d|[!#$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/
    const isEmailValidated = email.match(emailValidation)
    return isEmailValidated
  }
}

export default EditBillingInformationBillingEmail
