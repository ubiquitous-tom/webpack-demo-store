import Backbone, { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import template from './index.hbs'

import MembershipSignUpModal from './partials'
import MembershipSignUpModel from './model'

class MembershipSignUp extends View {
  get el() {
    return '.give.store.container'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'change #email': 'checkEmail',
      'click #sign-in-link': 'signInTemplate',
    }
  }

  initialize(options) {
    console.log('MembershipSignUp initialize')
    this.i18n = options.i18n

    this.membershipSignUpModel = new MembershipSignUpModel()
    this.popup = new MembershipSignUpModal({ model: this.model, i18n: this.i18n })
    // const isLoggedIn = this.model.get('Session').LoggedIn
    // const isRecordedBook = (
    //   this.model.has('Membership')
    //   && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    // )

    this.listenTo(this.model, 'membership:checkout', (model, value) => {
      console.log(model, value)
      // debugger
      if (this.validateSignUpForm()) {
        // `Customer.StripEnabled` is unique to only in Acorn Store service
        // if the customer updated the Stripe card in Store then it will be set to `true`
        const stripeEnabled = this.model.get('Customer')?.StripeEnabled
        const isLoggedIn = this.model.get('Session')?.LoggedIn

        if (stripeEnabled && isLoggedIn) {
          Backbone.history.navigate('reviewPurchase', { trigger: true })
        } else {
          // const customer = {
          //   Customer: {
          //     Email: this.$el.find('#signUpForm #email').val().trim(),
          //   },
          // }
          debugger
          // this.model.set(customer)
          if (this.model.has('Customer') && !_.isEmpty(this.model.get('Customer').Email)) {
            Backbone.history.navigate('editBilling', { trigger: true })
          }
          // this.popup.displayLoader()
          // this.popup.render()
        }
      }
    })

    this.listenTo(this.model, 'membership:accountAlreadyExist', (model, value) => {
      console.log(model, value)
      debugger
      this.renderSignInTemplate()
      this.membershipSignUpModel.unset('membership:accountAlreadyExist', { silent: true })
    })

    this.listenTo(this.membershipSignUpModel, 'change:checkProfileEmailSuccess', (model, value) => {
      console.log(model, value)
      // debugger
      this.popup.removeLoader()

      if (value) {
        // profile existed
        console.log('checkProfileEmailSuccess true')
        this.popup.render()
      } else {
        console.log('checkProfileEmailSuccess false')
        // Set up temp Customer info for the `editBilling` page
        // for the a brand NEW customer
        const customer = {
          Customer: {
            Name: [this.$el.find('#firstName').val(), this.$el.find('#lastName').val()].join(' '),
            Email: this.$el.find('#email').val(),
          },
        }
        this.model.set(customer)
        // Backbone.history.navigate('editBilling', { trigger: true })
      }
      this.membershipSignUpModel.unset('checkProfileEmailSuccess', { silent: true })
      console.log(this.model.attributes)
    })

    // if (!isLoggedIn) {
    //   this.render()
    // }
  }

  render() {
    console.log('MembershipSignUp render')
    console.log(this.model.attributes)
    const { firstName, lastName } = (this.model.has('Customer'))
      ? this.model.get('Customer').Email.split(/(?<=^\S+)\s/)
      : { firstName: '', lastName: '' }
    const email = this.model.get('Customer')?.Email
    const attributes = {
      firstName,
      lastName,
      email,
    }
    const html = this.template(attributes)
    if (this.$el.find('#signInForm').length) {
      this.$el.find('#signInForm').replaceWith(html)
    } else {
      this.$el.append(html)
    }

    return this
  }

  checkEmail(e) {
    console.log('checkEmail')
    console.log(e, e.target.value)
    e.preventDefault()
    const email = e.target.value
    /* eslint no-control-regex: 0 */
    const emailValidation = /^((([a-z]|\d|[!#$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/
    const isEmailValidated = email.match(emailValidation)
    if (this.validateSignUpForm() && isEmailValidated) {
      this.popup.displayLoader()
      this.membershipSignUpModel.checkEmail(email)
    }
  }

  signInTemplate(e) {
    e.preventDefault()
    this.renderSignInTemplate()
  }

  renderSignInTemplate() {
    this.model.get('membershipSignIn').render()
  }

  validateSignUpForm() {
    const firstName = this.$el.find('#firstName')
    const lastName = this.$el.find('#lastName')
    const email = this.$el.find('#email')
    // reset all errors
    firstName.closest('.form-group').removeClass('has-error')
    lastName.closest('.form-group').removeClass('has-error')
    email.closest('.form-group').removeClass('has-error')

    // set error if no value
    const firstNameVal = firstName.val().trim()
    const lastNameVal = lastName.val().trim()
    const emailVal = email.val().trim()
    if (!firstNameVal) {
      firstName.closest('.form-group').addClass('has-error')
    }
    if (!lastNameVal) {
      lastName.closest('.form-group').addClass('has-error')
    }
    if (!emailVal) {
      email.closest('.form-group').addClass('has-error')
    }

    if (
      firstName.closest('.form-group').hasClass('has-error')
      || lastName.closest('.form-group').hasClass('has-error')
      || email.closest('.form-group').hasClass('has-error')
    ) {
      $('html, body').animate({ scrollTop: 0 }, 'slow')
      return false
    }

    return true
  }
}

export default MembershipSignUp
