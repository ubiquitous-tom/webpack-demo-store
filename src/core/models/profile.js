import { Model } from 'backbone'
import _ from 'underscore'

class ProfileModel extends Model {
  get url() {
    return '/profile'
  }

  initialize() {
    console.log('ProfileModel initialize')
    console.log(this)
  }

  parse(resp) {
    console.log('ProfileModel parse')
    console.log(resp)
    // debugger

    return resp
  }

  /* eslint consistent-return: 0 */
  validate(attributes, options) {
    console.log('ProfileModel validate')
    console.log(attributes, options)
    // debugger
    if (_.isEmpty(attributes.Email)) {
      console.log('please enter profile email')
      return 'please enter profile email'
    }
  }

  loadProfile(email) {
    console.log('ProfileModel loadProfile')
    console.log(email)
    // debugger
    const params = {
      url: [this.url, $.param({ Email: email })].join('?'),
      ajaxSync: true,
      context: this,
      dataType: 'json',
      wait: true,
      success: this.success,
      error: this.error,
    }
    console.log(params)
    this.fetch(params)
  }

  success(model, resp, options) {
    console.log('ProfileModel success')
    console.log(model, resp, options)
    console.log(this)
    // debugger
    // this.set({ profile: resp }, { silent: true })
    this.set({
      profileSuccess: true,
      profile: resp,
    })
  }

  error(model, resp, options) {
    console.log('ProfileModel error')
    console.log(model, resp, options)
    console.log(this)
    // debugger
    let message = 'ERR-RETRIEVE-PROFILE'
    /* eslint function-paren-newline: 0 */
    resp
      .then(
        (response) => {
          console.log(response.responseJSON, response.responseText)
          if (!_.isEmpty(response.responseJSON)) {
            message = response.responseJSON.message
            return message
          }
          if (!_.isEmpty(response.responseText)) {
            message = response.responseText
            return message
          }
          return message
        },
        (error) => {
          console.log(error.responseJSON, error.responseText)
          if (!_.isEmpty(error.responseJSON)) {
            message = error.responseJSON.error
            return message
          }
          if (!_.isEmpty(error.responseText)) {
            message = error.responseText
            return message
          }
          return message
        })
      .always(() => {
        // New Error handing for the update promocode of 2024. [DWT1-932]
        if (_.isObject(message)) {
          message = Object.values(message)
        }
        model.set({
          profileSuccess: false,
          message,
        })
        // console.log(model.get('flashMessage').message, model.get('flashMessage').type)
      })
  }
}

export default ProfileModel
