import ATVModel from 'core/model'
import _ from 'underscore'

import docCookies from 'doc-cookies'

class GiveSignInModel extends ATVModel {
  get defaults() {
    return {
      stuff: true,
    }
  }

  get url() {
    return '/initializeapp'
  }

  initialize() {
    console.log('GiveSignInModel initialize')

    this.on('change:Session', (model, value, options) => {
      console.log(model, value, options)
      debugger
      docCookies.setItem('ATVSessionCookie', value.SessionID)
    })
  }

  /* eslint consistent-return: 0 */
  /* eslint no-unused-vars: 0 */
  validate(attrs, options) {
    if (_.isEmpty(attrs.Credentials.Username)) {
      console.log('please enter your email')
      return 'EMAIL-IS-REQUIRED'
    }

    if (_.isEmpty(attrs.Credentials.Password)) {
      console.log('please enter your password')
      return 'PASSWORD-IS-REQUIRED'
    }
  }

  signIn(data) {
    console.log('GiveSignInModel signIn')
    const {
      email,
      password,
    } = data
    // const headers = {
    //   StripeCustomerId: this.get('stripeCustomerId'),
    //   CustomerId: this.get('customerId'),
    //   StripeCardToken: stripeCardTokenID,
    // }

    const attributes = {
      App: {
        AppVersion: 'Sign-Up-Website',
      },
      Credentials: {
        Username: email,
        Password: password,
      },
      Request: {
        OperationalScenario: 'SIGNIN',
      },
    }

    const options = {
      url: this.url,
      context: this,
      dataType: 'json',
      ajaxSync: true,
      wait: true,
      // headers,
      success: this.success,
      error: this.error,
    }

    console.log(attributes, options)
    // debugger
    this.save(attributes, options)
  }

  parse(resp) {
    console.log('GiveSignInModel parse')
    console.log(resp)
    // debugger
    return resp
    // const data = {}

    // /* eslint no-param-reassign: "error" */
    // resp.forEach((item) => {
    //   item.i18nKey = item.title.toUpperCase().replace(/\s+/g, '-')
    //   item.displayClasses = item.classes.join(' ')
    //   console.log(item.url)
    //   const baseURL = `https://${this.get('environment')}acorn.tv/`
    //   console.log(baseURL)
    //   const url = new URL(item.url, baseURL)
    //   console.log(url)
    //   item.headerNavURL = url.href
    // })
    // data.navData = resp
    // // debugger
    // return data
  }

  success(model, resp, options) {
    console.log('GiveSignInModel success')
    console.log(model, resp, options)
    // debugger
    model.set({
      signInSuccess: true,
    })
    console.log(model)
  }

  error(model, resp, options) {
    console.log('GiveSignInModel error')
    console.log(model, resp, options)
    // debugger
    let message = ''
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
        model.set({
          signInSuccess: false,
          message,
        })
      })
  }
}

export default GiveSignInModel
