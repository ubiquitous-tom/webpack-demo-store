import { View } from 'backbone'
import _ from 'underscore'

import SubmitLoader from 'shared/elements/submit-loader/'
import FlashMessage from 'shared/elements/flash-message'
import template from './index.hbs'
import EditPasswordModel from './model'

class EditPassword extends View {
  get el() {
    return 'section'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'input #Password': 'validatePassword',
      'blur #Password': 'validatePassword',
      'input #ConfirmPassword': 'validatePassword',
      'blur #ConfirmPassword': 'validatePassword',
      'submit #changePasswordForm': 'verifySamePassword',
    }
  }

  initialize(options) {
    console.log('EditPassword initialize')
    this.sessionID = options.model.attributes.Session.SessionID
    this.i18n = options.i18n

    this.submitLoader = new SubmitLoader()
    this.flashMessage = new FlashMessage()
    this.model = new EditPasswordModel()
    this.render()

    this.listenTo(this.model, 'invalid', (model, error, options) => {
      console.log(model, error, options)
      const message = this.i18n.t(error)
      debugger
      this.flashMessage.onFlashMessageShow(message, 'error')
      this.loadingStop(model, error, options)
    })

    /* eslint no-shadow: 0 */
    this.listenTo(this.model, 'change:editPasswordSuccess', (model, value, options) => {
      console.log(model, value, options)
      let message = this.i18n.t('ERR-RST-PASS')
      if (value) {
        message = this.i18n.t('PASSWORD-CHANGED')
      }
      debugger
      this.flashMessage.onFlashMessageShow(message, model.get('type'))
      this.loadingStop(model, value, options)
    })

    this.listenTo(this.model, 'error', (model, xhr, options) => {
      console.log(model, xhr, options)
      const message = this.i18n.t('ERROR')
      debugger
      this.flashMessage.onFlashMessageShow(message, 'error')
      this.loadingStop(model, xhr, options)
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
      e.target.setCustomValidity(this.i18n.t('CHANGING-YOUR-PASSWORD'))
    } else if (e.target.validity.tooShort) {
      e.target.parentElement.classList.add('has-error')
      e.target.setCustomValidity(this.i18n.t('PASSWORD-CHARACTERS'))
    }
  }

  validateConfirmPassword(e) {
    // Reset errors.
    e.target.parentElement.classList.remove('has-error')
    e.target.setCustomValidity('')

    // Check for errors.
    if (e.target.validity.valueMissing) {
      e.target.parentElement.classList.add('has-error')
      e.target.setCustomValidity(this.i18n.t('CHANGING-YOUR-PASSWORD'))
    } else {
      if (e.target.validity.tooShort) {
        e.target.parentElement.classList.add('has-error')
        e.target.setCustomValidity(this.i18n.t('PASSWORD-CHARACTERS'))
      }

      /* eslint eqeqeq: 0 */
      if (this.$el.find('#Password').val() != e.target.value) {
        this.$el.find('#Password')[0].setCustomValidity((this.i18n.t('PASSWORDS-DONT-MATCH')))
        this.$el.find('#Password')[0].parentElement.classList.add('has-error')
        e.target.setCustomValidity((this.i18n.t('PASSWORDS-DONT-MATCH')))
        e.target.parentElement.classList.add('has-error')
      }
    }
  }

  changePassword(e) {
    console.log('EditPassword changePassword')
    e.preventDefault()
    const params = $(e.currentTarget).serializeArray()
    this.loadingStart()
    this.model.changePassword(params, this.sessionID)
  }

  verifySamePassword(e) {
    e.preventDefault()
    // console.log(e)
    let password = ''
    let confirmPassword = ''
    /* eslint no-unused-vars: 0 */
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
      password.setCustomValidity((this.i18n.t('PASSWORDS-DONT-MATCH')))
      password.parentElement.classList.add('has-error')
      confirmPassword.setCustomValidity((this.i18n.t('PASSWORDS-DONT-MATCH')))
      confirmPassword.parentElement.classList.add('has-error')
    } else {
      this.changePassword(e)
    }
  }

  loadingStart() {
    console.log('EditPassword loadingStart')
    this.$el.find('#changePasswordForm input').prop('disabled', true)
    this.submitLoader.loadingStart(this.$el.find('#changePasswordForm button'))
  }

  loadingStop(model, xhr, options) {
    console.log('EditPassword loadingStop')
    console.log(model, xhr, options)
    console.log(this)
    this.$el.find('#changePasswordForm input').val('').prop('disabled', false)
    this.submitLoader.loadingStop(this.$el.find('#changePasswordForm button'))
  }
}

export default EditPassword
