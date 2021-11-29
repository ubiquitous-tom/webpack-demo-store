import { View } from 'backbone'
import _ from 'underscore'

import template from './temp.html'
import EditPasswordModel from './model'
import FlashMessage from '../shared/elements/flash-message'

class EditPassword extends View {

  get el() {
    return 'section'
  }

  get template() {
    return _.template(template)
  }

  get events() {
    return {
      'input #Password': 'validatePassword',
      'blur #Password': 'validatePassword',
      'input #ConfirmPassword': 'validatePassword',//'validateConfirmPassword',
      'blur #ConfirmPassword': 'validatePassword',//'validateConfirmPassword',
      'submit #changePasswordForm': 'verifySamePassword',//'changePassword'
    }
  }

  initialize(options) {
    console.log('EditPassword initialize')
    this.sessionID = options.model.attributes.Session.SessionID

    this.flashMessage = new FlashMessage()
    this.model = new EditPasswordModel()
    this.render()

    this.listenTo(this.model, 'change:editPasswordSuccess', (model, value, options) => {
      console.log(model, value, options)
      this.flashMessage.onFlashMessageShow(this.model.get('message'), this.model.get('type'))
    })

  }

  render() {
    console.log('EditPassword render')
    this.$el.html(this.template())

    return this
  }

  validatePassword(e) {
    // Reset errors.
    e.target.parentElement.classList.remove('has-error')
    e.target.setCustomValidity('')

    // Check for errors.
    if (e.target.validity.valueMissing) {
      e.target.parentElement.classList.add('has-error')
      // e.target.setCustomValidity(polyglot.t('CHANGING-YOUR-PASSWORD'))
      e.target.setCustomValidity('If you wish to change your password, please provide the details below.')
    } else {
      if (e.target.validity.tooShort) {
        e.target.parentElement.classList.add('has-error')
        // e.target.setCustomValidity(polyglot.t('PASSWORD-CHARACTERS'))
        e.target.setCustomValidity('Password * Please enter a minimum of 6 characters')
      }
    }
  }

  validateConfirmPassword(e) {
    // Reset errors.
    e.target.parentElement.classList.remove('has-error')
    e.target.setCustomValidity('')

    // Check for errors.
    if (e.target.validity.valueMissing) {
      e.target.parentElement.classList.add('has-error')
      // e.target.setCustomValidity(polyglot.t('CHANGING-YOUR-PASSWORD'))
      e.target.setCustomValidity('If you wish to change your password, please provide the details below.')
    } else {
      if (e.target.validity.tooShort) {
        e.target.parentElement.classList.add('has-error')
        // e.target.setCustomValidity(polyglot.t('PASSWORD-CHARACTERS'))
        e.target.setCustomValidity('Password * Please enter a minimum of 6 characters')
      }

      if (this.$el.find('#Password').val() != e.target.value) {
        // this.$el.find('#Password')[0].setCustomValidity((polyglot.t('PASSWORDS-DONT-MATCH')))
        this.$el.find('#Password')[0].setCustomValidity('The password and confirm passwords don\'t match')
        this.$el.find('#Password')[0].parentElement.classList.add('has-error')
        // e.target.setCustomValidity((polyglot.t('PASSWORDS-DONT-MATCH')))
        e.target.setCustomValidity('The password and confirm passwords don\'t match')
        e.target.parentElement.classList.add('has-error')
      }
    }
  }

  changePassword(e) {
    e.preventDefault()
    console.log('EditPassword changePassword')
    // const params = $(e.currentTarget).serialize()
    const params = $(e.currentTarget).serializeArray()
    // console.log(params)
    this.model.changePassword(params, this.sessionID)
  }

  verifySamePassword(e) {
    e.preventDefault()
    // console.log(e)
    let password = ''
    let confirmPassword = ''
    $(e.target).find('input').each((index, element, collection) => {
      // console.log(index, element, collection)
      if (index === 0) {
        password = element
      }
      confirmPassword = element
    })
    // console.log(password, confirmPassword, password.value, confirmPassword.value)

    // Reset errors.
    password.parentElement.classList.remove('has-error')
    password.setCustomValidity('')
    confirmPassword.parentElement.classList.remove('has-error')
    confirmPassword.setCustomValidity('')

    if (password.value !== confirmPassword.value) {
      // password.setCustomValidity((polyglot.t('PASSWORDS-DONT-MATCH')))
      password.setCustomValidity('The password and confirm passwords don\'t match')
      password.parentElement.classList.add('has-error')
      // confirmPassword.setCustomValidity((polyglot.t('PASSWORDS-DONT-MATCH')))
      confirmPassword.setCustomValidity('The password and confirm passwords don\'t match')
      confirmPassword.parentElement.classList.add('has-error')
    } else {
      this.changePassword(e)
    }
  }
}

export default EditPassword
