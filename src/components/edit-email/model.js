import { Model } from 'backbone'
import _ from 'underscore'
import Dispatcher from '../common/dispatcher'
import FlashMessage from '../shared/elements/flash-message/view'

class EditEmailModel extends Model {

  get url() {
    return '/changeemail'
  }

  initialize() {
    console.log('EditEmailModel initialize')

    this.dispatcher = new Dispatcher()
    this.flashMessage = new FlashMessage({ dispatcher: this.dispatcher })
    this.model = new Model()
    // console.log(this)

    this.listenTo(this, 'change', this.render)

    this.on('request', this.loadingStop)
    this.on('sync', this.success)
    this.on('error', this.error)
  }

  validate(attrs, options) {
    console.log('EditEmailModel validate')
    console.log(attrs)
    // console.log(options)

    if (_.isEmpty(attrs.Credentials.Password)) {
      console.log('please enter the email')
      return 'please enter the email'
    }

    if (_.isEmpty(attrs.Credentials.ConfirmPassword)) {
      console.log('please confirm the email')
      return 'please confirm the email'
    }

    if (attrs.Credentials.Password !== attrs.Credentials.ConfirmPassword) {
      console.log('email do not match')
      return 'email do not match'
    }

    console.log('EditEmailModel validate end')
  }

  parse(response) {
    console.log('EditEmailModel parse')
    console.log(response)
    return response
  }

  changeEmail(params) {
    console.log('EditEmailModel changeEmail')
    console.log(params)
    this.loadingStart()
    const attributes = {
      NewEmail: params[0].value,
      CurrentEmail: Customer.Email,
      ConfirmedEmail: params[1].value,
    }
    const options = {
      dataType: 'json',
      ajaxSync: true,
      wait: true,
      // success: this.success,
      // error: this.error
    }
    console.log(attributes, options)
    this.save(attributes, options)
  }

  success(model, resp, options) {
    console.log('EditEmailModel success')
    console.log(model, resp, options)
    this.set({
      type: 'success',
      message: 'Password is Changed',
    })
    // this.showFlashMessage(model, resp, options)
    this.dispatcher.trigger('flashMessage:show', 'Email is Changed', 'success')
  }

  error(model, resp, options) {
    console.log('EditEmailModel error')
    console.log(model, resp, options)
    this.set({
      type: 'error',
      message: ''
    })
    this.showFlashMessage(model, resp, options)
  }

  showFlashMessage(model, resp, options) {
    console.log('EditEmailModel showFlashMessage')
    resp
      .then(
        (response) => {
          console.log(response.responseJSON)
          if (!_.isEmpty(response.responseJSON)) {
            this.set('message', response.responseJSON.Changed)
          }
        },
        (error) => {
          console.log(error.responseJSON)
          if (!_.isEmpty(error.responseJSON)) {
            this.set('message', error.responseJSON.error)
          }
        })
      .always(() => {
        console.log(this.get('message'), this.get('type'))
        // console.log(this.dispatcher)
        this.dispatcher.trigger('flashMessage:show', this.get('message'), this.get('type'))
      })
  }

  loadingStart() {
    console.log('EditEmailModel loadingStart')
  }

  loadingStop(model, xhr, options) {
    console.log('EditEmailModel loadingStop')
  }
}

export default EditEmailModel
