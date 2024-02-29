import { View } from 'backbone'
import _ from 'underscore'

import Popup from 'shared/elements/popup'

import './stylesheet.scss'
import template from './index.hbs'

class EditBillingInformationBillingEmail extends View {
  get el() {
    return '#billingEmailContainer'
  }

  get template() {
    return template
  }

  get events() {
    return {
      // 'input input#billingEmail': 'validateEmail',
      'blur input#billingEmail': 'validateEmail',
      // 'input input#billingEmailConfirm': 'validateEmail',
      'blur input#billingEmailConfirm': 'validateEmail',
      // 'input input#membershipPassword': 'validate',
      'blur input#membershipPassword': 'validate',
      // 'input input#membershipPasswordConfirm': 'validate',
      'blur input#membershipPasswordConfirm': 'validate',
      'blur input#agree': 'validateCheckbox',
    }
  }

  initialize(options) {
    console.log('EditBillingInformationBillingEmail initialize')
    this.i18n = options.i18n
    this.cart = this.model.get('cart')

    this.popup = new Popup({ model: this.model, i18n: this.i18n })

    this.listenTo(this.model, 'editBilling:undelegateEvents', () => {
      console.log('EditBillingInformationBillingEmail garbageCollect')
      this.remove()
      // debugger
    })

    this.listenTo(this.model, 'editBillingValidation:email', (paymentInfo) => {
      console.log(paymentInfo)
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
      if (this.$('#billingEmail').length) {
        const emailEl = this.$('#billingEmail')
        emailEl.focus().blur()
        if (
          (emailEl[0].checkValidity() === false)
          && this.validateEmailFormat(emailEl.val())
        ) {
          this.popup.render()
          this.popup.setBodyContent(this.i18n.t(emailEl.data('message')))
          this.model.trigger('editBillingValidation:formError', emailEl.data('message'))
          return
        }

        const emailConfirmEl = this.$('#billingEmailConfirm')
        emailConfirmEl.focus().blur()
        if (
          (emailConfirmEl[0].checkValidity() === false)
          && this.validateEmailFormat(emailConfirmEl.val())
        ) {
          this.popup.render()
          this.popup.setBodyContent(this.i18n.t(emailConfirmEl.data('message')))
          this.model.trigger('editBillingValidation:formError', emailConfirmEl.data('message'))
          return
        }

        if (emailEl.val().trim() !== emailConfirmEl.val().trim()) {
          this.popup.render()
          this.popup.setBodyContent(this.i18n.t(emailConfirmEl.data('message')))
          this.model.trigger('editBillingValidation:formError', emailConfirmEl.data('message'))
          return
        }
        // debugger
        const paymentInfoEmails = {
          Customer: {
            Email: emailEl.val().trim(),
            MarketingOptIn: this.$('#marketing-agree').val(),
          },
        }
        // debugger
        _.extend(paymentInfo, paymentInfoEmails)
      }

      if (this.$('#membershipPassword').length) {
        const passwordEl = this.$('#membershipPassword')
        passwordEl.focus().blur()
        if (
          (passwordEl[0].checkValidity() === false)
          && this.validateEmailFormat(passwordEl.val())
        ) {
          this.popup.render()
          this.popup.setBodyContent(this.i18n.t(passwordEl.data('message')))
          this.model.trigger('editBillingValidation:formError', passwordEl.data('message'))
          return
        }

        const passwordConfirmEl = this.$('#membershipPasswordConfirm')
        passwordConfirmEl.focus().blur()
        if (
          (passwordConfirmEl[0].checkValidity() === false)
          && this.validateEmailFormat(passwordConfirmEl.val())
        ) {
          this.popup.render()
          this.popup.setBodyContent(this.i18n.t(passwordConfirmEl.data('message')))
          this.model.trigger('editBillingValidation:formError', passwordConfirmEl.data('message'))
          return
        }

        if (passwordEl.val().trim() !== passwordConfirmEl.val().trim()) {
          this.popup.render()
          this.popup.setBodyContent(this.i18n.t(passwordConfirmEl.data('message')))
          this.model.trigger('editBillingValidation:formError', passwordConfirmEl.data('message'))
          return
        }
        // debugger
        const paymentInfoPasswords = {
          Credentials: {
            Password: passwordEl.val().trim(),
          },
        }
        // debugger
        _.extend(paymentInfo, paymentInfoPasswords)
      }
      // debugger
      this.model.trigger('editBillingValidation:paymentMethod', paymentInfo)
    })

    const isLoggedIn = (this.model.has('Session') && this.model.get('Session').LoggedIn)
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
    const el = this.$(`#${id}`)
    if (!this.validateEmailFormat(value)) {
      el.parent('.form-group').removeClass('has-success').addClass('has-error')
      this.popup.render()
      this.popup.setBodyContent(this.i18n.t(el.data('message')))
      isValidated = false
    } else {
      el.parent('.form-group').removeClass('has-error')
    }

    return isValidated
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

  validateCheckbox(e) {
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

  validateEmailFormat(email) {
    /* eslint no-control-regex: 0 */
    const emailValidation = /^((([a-z]|\d|[!#$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/
    const isEmailValidated = email.match(emailValidation)
    return !_.isEmpty(isEmailValidated)
  }
}

export default EditBillingInformationBillingEmail
