import { View } from 'backbone'
import _ from 'underscore'

import template from './temp.html'
import EditEmailModel from './model'
import FlashMessage from '../shared/elements/flash-message'

class EditEmail extends View {

  get el() {
    return 'section'
  }

  get template() {
    return _.template(template)
  }

  get events() {
    return {
      'input #Email': 'validateEmail',
      'blur #Email': 'validateEmail',
      'input #ConfirmEmail': 'validateEmail',//'validateConfirmEmail',
      'blur #ConfirmEmail': 'validateEmail',//'validateConfirmEmail',
      'submit #changeEmailForm': 'verifySameEmail',//'changeEmail'
    }
  }

  initialize(options) {
    console.log('EditEmail initialize')
    this.defaultEmail = options.model.attributes.Customer.Email

    this.flashMessage = new FlashMessage()
    this.model = new EditEmailModel()
    this.render()

    this.listenTo(this.model, 'change:editEmailSuccess', (model, value, options) => {
      console.log(model, value, options)
      debugger
      this.flashMessage.onFlashMessageShow(this.model.get('message'), this.model.get('type'))
    })
  }

  render() {
    console.log('EditEmail render')
    this.$el.html(this.template())

    return this
  }

  validateEmail(e) {
    // Reset errors.
    e.target.parentElement.classList.remove('has-error')
    e.target.setCustomValidity('')

    // Check for errors.
    if (e.target.validity.valueMissing) {
      e.target.parentElement.classList.add('has-error')
      // e.target.setCustomValidity(polyglot.t('EMAIL-IS-REQUIRED'))
      e.target.setCustomValidity('Email is required')
    } else {
      if (e.target.validity.tooShort) {
        e.target.parentElement.classList.add('has-error')
        // e.target.setCustomValidity(polyglot.t('ENTER-AN-EMAIL'))
        e.target.setCustomValidity('Please enter an email')
      }
    }
  }

  validateConfirmEmail(e) {
    // Reset errors.
    e.target.parentElement.classList.remove('has-error')
    e.target.setCustomValidity('')

    // Check for errors.
    if (e.target.validity.valueMissing) {
      e.target.parentElement.classList.add('has-error')
      // e.target.setCustomValidity(polyglot.t('EMAIL-IS-REQUIRED'))
      e.target.setCustomValidity('Email is required')
    } else {
      if (e.target.validity.tooShort) {
        e.target.parentElement.classList.add('has-error')
        // e.target.setCustomValidity(polyglot.t('ENTER-AN-EMAIL'))
        e.target.setCustomValidity('Please enter an email')
      }

      if (this.$el.find('#Password').val() != e.target.value) {
        // this.$el.find('#Password')[0].setCustomValidity((polyglot.t('EMAILS-DONT-MATCH')))
        this.$el.find('#Password')[0].setCustomValidity('The emails do not match')
        this.$el.find('#Password')[0].parentElement.classList.add('has-error')
        // e.target.setCustomValidity((polyglot.t('EMAILS-DONT-MATCH')))
        e.target.setCustomValidity('The emails do not match')
        e.target.parentElement.classList.add('has-error')
      }
    }
  }

  verifySameEmail(e) {
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
      // password.setCustomValidity((polyglot.t('EMAILS-DONT-MATCH')))
      password.setCustomValidity('The emails do not match')
      password.parentElement.classList.add('has-error')
      // confirmPassword.setCustomValidity((polyglot.t('EMAILS-DONT-MATCH')))
      confirmPassword.setCustomValidity('The emails do not match')
      confirmPassword.parentElement.classList.add('has-error')
    } else {
      this.changeEmail(e)
    }
  }

  changeEmail(e) {
    e.preventDefault()
    console.log('EditEmail changeEmail')
    // const params = $(e.currentTarget).serialize()
    const params = $(e.currentTarget).serializeArray()
    // console.log(params)
    this.model.changeEmail(params, this.defaultEmail)
  }
}

export default EditEmail
