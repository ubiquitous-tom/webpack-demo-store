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
      'input input#billingEmail': 'validate',
      'blur input#billingEmail': 'validate',
      'input input#billingEmailConfirm': 'validate',
      'blur input#billingEmailConfirm': 'validate',
      'input input#membershipPassword': 'validate',
      'blur input#membershipPassword': 'validate',
      'input input#membershipPasswordConfirm': 'validate',
      'blur input#membershipPasswordConfirm': 'validate',
    }
  }

  initialize() {
    console.log('EditBillingInformationBillingEmail initialize')
    this.cart = this.model.get('cart')

    this.listenTo(this.model, 'editBillingValidation:email', (model, context) => {
      console.log(model, context)
      debugger
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

      if (context.$el.find('#billingEmail').length) {
        const paymentInfo = model.get('paymentInfo')
        if (
          (
            context.$el.find('#billingEmail')[0].checkValidity()
            && this.validateEmail(context.$el.find('#billingEmail').val())
          )
          && (
            context.$el.find('#billingEmailConfirm')[0].checkValidity()
            && this.validateEmail(context.$el.find('#billingEmailConfirm').val())
          )
          && (context.$el.find('#billingEmail').val().trim() === context.$el.find('#billingEmailConfirm').val().trim())
        ) {
          const customer = {
            Customer: {
              Email: context.$el.find('#billingEmail').val(),
              MarketingOptIn: context.$el.find('#marketing-agree').val(),
            },
          }
          _.extend(paymentInfo, customer)
        }

        if (
          context.$el.find('#membershipPassword')[0].checkValidity()
          && context.$el.find('#membershipPasswordConfirm')[0].checkValidity()
          && (context.$el.find('#membershipPassword').val().trim() === context.$el.find('#membershipPasswordConfirm').val().trim())
        ) {
          // const paymentInfo = model.get('paymentInfo')
          const credentials = {
            Credentials: {
              Password: context.$el.find('#membershipPassword').val(),
            },
          }
          _.extend(paymentInfo, credentials)
        }
        debugger
        model.set(paymentInfo)
      }
      debugger
      model.trigger('editBillingValidation:paymentMethod', model, context)
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
