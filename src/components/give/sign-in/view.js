import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import template from './index.hbs'

import GiveSignInModel from './model'
import GivesignInModal from './partials'

class GiveSignIn extends View {
  get el() {
    return '.give.store.container'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'input input#email': 'validateEmail',
      'blur input#email': 'validateEmail',
      'input input#password': 'validate',
      'blur input#password': 'validate',
      'change #becomeMember': 'getAnnualMembership',
      'submit #sign-in-form': 'signIn',
    }
  }

  initialize(options) {
    console.log('GiveSignIn initialize')
    this.i18n = options.i18n
    this.cart = this.model.get('cart')

    this.giveSignInModel = new GiveSignInModel()
    this.popup = new GivesignInModal({ model: this.model, i18n: this.i18n })

    this.listenTo(this.model, 'give:undelegateEvents', () => {
      console.log('GiveSignIn garbageCollect')
      this.remove()
      // debugger
    })

    this.listenTo(this.giveSignInModel, 'change:signInSuccess', (model, value) => {
      console.log(model, value)
      // debugger
      if (value) {
        window.location.reload()
      } else {
        this.removeLoader()
        this.$('#email').parent('.form-group').addClass('has-error')
        this.$('#password').parent('.form-group').addClass('has-error')

        this.popup.render()

        const errorMessage = model.get('message')
        this.popup.setModalBody(errorMessage)
      }
      model.unset('signInSuccess', { silent: true })
    })

    this.listenTo(this.cart, 'change:annual', (model, value) => {
      console.log(model, value)
      if (value.quantity) {
        this.$('#becomeMember').prop('checked', true)
      } else {
        this.$('#becomeMember').prop('checked', false)
      }
    })

    const isLoggedIn = (this.model.has('Session') && this.model.get('Session').LoggedIn)
    if (!isLoggedIn) {
      this.render()
    }
  }

  render() {
    console.log('GiveSignIn render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.append(html)

    this.setElement('#give-subscribe-sign-in-section')

    this.subscriptionOptIn()

    return this
  }

  validateEmail(e) {
    const { id, value } = e.target
    console.log('validate', id, value)
    let isValidated = true
    const el = this.$(`#${id}`)
    if (!this.validateEmailFormat(value) && !el[0].checkValidity()) {
      el.parent('.form-group').removeClass('has-success').addClass('has-error')
      isValidated = false
    } else {
      el.parent('.form-group').removeClass('has-error')
    }

    return isValidated
  }

  validate(e) {
    const { id, value } = e.target
    console.log('validate', id, value)
    let isValidated = true
    const el = this.$(`#${id}`)
    if (_.isEmpty(value) && !el[0].checkValidity()) {
      el.parent('.form-group').removeClass('has-success').addClass('has-error')
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
    return isEmailValidated
  }

  subscriptionOptIn() {
    if (this.cart?.get('annual')?.quantity > 0) {
      this.$('#becomeMember').prop('checked', true)
    }
  }

  getAnnualMembership(e) {
    console.log('GiveSignIn getAnnualMembership')
    e.preventDefault()
    console.log(e.target, e.target.checked)
    const optIn = e.target.checked // this.$('#becomeMember').is(':checked');
    if (optIn) {
      this.addAnnualMembership()
    } else {
      this.removeAnnualMembership()
    }
  }

  addAnnualMembership() {
    // if (this.cart?.get('annual')?.quantity > 0) {
    const quantity = 1
    const amount = (this.model.has('membershipPromo'))
      ? this.cart?.get('annual')?.amount
      : this.model.get('annualStripePlan')?.SubscriptionAmount
    const total = parseFloat((quantity * amount).toFixed(2))
    const membership = {
      annual: {
        quantity,
        amount,
        total,
      },
    }
    this.cart.set(membership)
    // }
    console.log(this.model.attributes)
  }

  removeAnnualMembership() {
    console.log('GiveTaGiveSignInline removeMember')
    // this.$('#membershipItem').slideUp(500, () => {
    const quantity = 0
    const amount = (this.model.has('membershipPromo'))
      ? this.cart?.get('annual')?.amount
      : this.model.get('annualStripePlan')?.SubscriptionAmount
    const total = 0
    const membership = {
      annual: {
        quantity,
        amount,
        total,
      },
    }
    this.cart.set(membership)
    console.log(this.model.attributes)
    // })
  }

  signIn(e) {
    console.log('GiveSignIn signIn')
    e.preventDefault()
    this.$('#email').focus().blur()
    this.$('#password').focus().blur()
    const data = {
      email: this.$('#email').val(),
      password: this.$('#password').val(),
    }

    this
      .$('.sign-in input')
      .prop('disabled', true)

    this
      .$('.sign-in button')
      .prop('disabled', true)

    this.displayLoader(data)
    // this.giveSignInModel.signIn(data)
  }

  displayLoader(data) {
    const loader = `<i class="icon-spinner icon-spin icon-large"></i> ${this.i18n.t('SIGNING-IN')}`
    const modal = $('<div>')
      .attr({ id: 'signInAlert' })
      .addClass('alert alert-info')
      .css({ display: 'none' })
      .html(loader)
    // debugger
    this
      .$('.sign-in')
      .after(modal)
    // debugger
    this
      .$('#signInAlert')
      .slideDown(400, () => {
        // debugger
        this.giveSignInModel.signIn(data)
      })
  }

  removeLoader() {
    $('#signInAlert')
      .slideUp(400, () => {
        $(this).remove()
      })

    this
      .$('.sign-in input')
      .prop('disabled', false)

    this
      .$('.sign-in button')
      .prop('disabled', false)
  }
}

export default GiveSignIn
