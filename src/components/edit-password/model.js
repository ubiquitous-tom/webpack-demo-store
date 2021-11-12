import { Model } from 'backbone'
import _ from 'underscore'
import Dispatcher from '../common/dispatcher'
import FlashMessage from '../shared/elements/flash-message/view'

class EditPasswordModel extends Model {

  get url() {
    return '/changepassword'
  }

  initialize() {
    console.log('EditPasswordModel initialize')

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
    console.log('EditPasswordModel validate')
    console.log(attrs)
    // console.log(options)

    if (_.isEmpty(attrs.Credentials.Password)) {
      console.log('please enter the password')
      return 'please enter the password'
    }

    if (_.isEmpty(attrs.Credentials.ConfirmPassword)) {
      console.log('please confirm the password')
      return 'please confirm the password'
    }

    if (attrs.Credentials.Password !== attrs.Credentials.ConfirmPassword) {
      console.log('password do not match')
      return 'password do not match'
    }

    console.log('EditPasswordModel validate end')
  }

  parse(response) {
    console.log('EditPasswordModel parse')
    console.log(response)
    return response
  }

  changePassword(params) {
    console.log('EditPasswordModel changePassword')
    console.log(params)
    this.loadingStart()
    const attributes = {
      Session: {
        SessionID: this.get('Session').SessionID,//'fa4dfd02-9870-44fd-8d31-037c57c8a627'//this.get('Session').SessionID
      },
      Credentials: {
        Password: params[0].value,
        ConfirmPassword: params[1].value,
      }
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
    console.log('EditPasswordModel success')
    console.log(model, resp, options)
    this.set({
      type: 'success',
      message: 'Password is Changed',
    })
    // this.showFlashMessage(model, resp, options)
    this.dispatcher.trigger('showFlashMessage', 'Password is Changed', 'success')
  }

  error(model, resp, options) {
    console.log('EditPasswordModel error')
    console.log(model, resp, options)
    this.set({
      type: 'error',
      message: ''
    })
    this.showFlashMessage(model, resp, options)
  }

  showFlashMessage(model, resp, options) {
    console.log('EditPasswordModel showFlashMessage')
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
        this.dispatcher.trigger('showFlashMessage', this.get('message'), this.get('type'))
      })
  }

  loadingStart() {
    console.log('EditPasswordModel loadingStart')
  }

  loadingStop(model, xhr, options) {
    console.log('EditPasswordModel loadingStop')
  }
}

export default EditPasswordModel
