import { View } from 'backbone'
import _ from 'underscore'

import MParticle from 'shared/elements/mparticle'

import './stylesheet.scss'
import template from './index.hbs'

import MembershipSignInModel from './model'
import MembershipSignInModal from './partials'

class MembershipSignIn extends View {
  get el() {
    return '.membership.store.container'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'input input#signInEmail': 'validateEmail',
      'blur input#signInEmail': 'validateEmail',
      'input input#password': 'validate',
      'blur input#password': 'validate',
      'click #backToSignup': 'signUpTemplate',
      'submit #sign-in-form': 'signIn',
    }
  }

  initialize(options) {
    console.log('MembershipSignIn initialize')
    this.i18n = options.i18n

    this.membershipSignInModel = new MembershipSignInModel()
    this.popup = new MembershipSignInModal({ model: this.model, i18n: this.i18n })

    this.listenTo(this.model, 'membership:undelegateEvents', () => {
      console.log('MembershipSignIn garbageCollect')
      this.remove()
      // debugger
    })

    this.listenTo(this.membershipSignInModel, 'change:signInSuccess', (model, value) => {
      console.log(model, value)
      // debugger
      if (value) {
        this.mParticle = new MParticle({ model })
        debugger
        this.mParticle.login()
        window.location.reload()
      } else {
        this.removeLoader()
        this.$('#signInEmail').parent('.form-group').addClass('has-error')
        this.$('#password').parent('.form-group').addClass('has-error')

        this.popup.render()

        const errorMessage = model.get('message')
        this.popup.setModalBody(errorMessage)
      }
      model.unset('signInSuccess', { silent: true })
    })

    // const isLoggedIn = this.model.get('Session').LoggedIn
    // const isRecordedBook = (
    //   this.model.has('Membership')
    //   && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    // )

    // if (!isLoggedIn) {
    //   this.render()
    // }
  }

  render() {
    console.log('MembershipSignIn render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    if ($('#signUpForm').length) {
      $('#signUpForm').replaceWith(html)
    } else {
      this.$el.append(html)
    }

    this.setElement('#signInForm')

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

  signUpTemplate(e) {
    e.preventDefault()
    this.model.get('membershipSignUp').render()
  }

  signIn(e) {
    console.log('MembershipSignIn signIn')
    e.preventDefault()
    // debugger
    this.$('#signInEmail').focus().blur()
    this.$('#password').focus().blur()
    const data = {
      email: this.$('#signInEmail').val(),
      password: this.$('#password').val(),
    }
    // debugger
    this
      .$('input')
      .prop('disabled', true)
    this
      .$('button')
      .prop('disabled', true)

    this.displayLoader(data)
  }

  displayLoader(data) {
    const loader = `<i class="icon-spinner icon-spin icon-large"></i> ${this.i18n.t('SIGNING-IN')}`
    const modal = $('<div>')
      .attr({ id: 'signInAlert' })
      .addClass('alert alert-info')
      .css({ display: 'none' })
      .html(loader)
    // debugger
    this.$el
      .after(modal)
    // debugger
    $('#signInAlert')
      .slideDown(400, () => {
        // debugger
        this.membershipSignInModel.signIn(data)
      })
  }

  removeLoader() {
    $('#signInAlert')
      .slideUp(400, () => {
        $('#signInAlert').remove()
      })

    this
      .$('input')
      .prop('disabled', false)
    this
      .$('button')
      .prop('disabled', false)
  }
}

export default MembershipSignIn
