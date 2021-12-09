import { Model } from 'backbone'
import _ from 'underscore'

class EditPasswordModel extends Model {
  get url() {
    return '/changepassword'
  }

  initialize() {
    console.log('EditPasswordModel initialize')

    this.model = new Model()
    // console.log(this)
    // this.listenTo(this, 'change', this.render)

    this.on('request', this.loadingStop)
    // this.on('sync', this.success)
    // this.on('error', this.error)
  }

  /* eslint consistent-return: 0 */
  /* eslint no-unused-vars: 0 */
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

  changePassword(params, sessionID) {
    console.log('EditPasswordModel changePassword')
    console.log(params)
    this.loadingStart()
    const attributes = {
      Session: {
        SessionID: sessionID,
      },
      Credentials: {
        Password: params[0].value,
        ConfirmPassword: params[1].value,
      },
    }
    const options = {
      dataType: 'json',
      ajaxSync: true,
      wait: true,
      success: this.success,
      error: this.error,
    }
    console.log(attributes, options)
    this.save(attributes, options)
  }

  success(model, resp, options) {
    console.log('EditPasswordModel success')
    console.log(model, resp, options)
    model.set({
      editPasswordSuccess: true,
      type: 'success',
      message: 'Password is Changed',
    })
  }

  error(model, resp, options) {
    console.log('EditPasswordModel error')
    console.log(model, resp, options)
    /* eslint function-paren-newline: 0 */
    resp
      .then(
        (response) => {
          console.log(response.responseJSON)
          if (!_.isEmpty(response.responseJSON)) {
            model.set({
              editPasswordSuccess: false,
              type: 'error',
              message: response.responseJSON.Changed,
            })
          }
        },
        (error) => {
          console.log(error.responseJSON)
          if (!_.isEmpty(error.responseJSON)) {
            model.set({
              editPasswordSuccess: false,
              type: 'error',
              message: error.responseJSON.error,
            })
          }
        })
      .always(() => {
        console.log(model.get('message'), model.get('type'))
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
