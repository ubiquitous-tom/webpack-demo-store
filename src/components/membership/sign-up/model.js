import ATVModel from 'core/model'
import _ from 'underscore'

// import docCookies from 'doc-cookies'

class MembershipSignUpModel extends ATVModel {
  // get defaults() {
  //   return {
  //     stuff: true,
  //   }
  // }

  get url() {
    return '/profile'
  }

  initialize() {
    console.log('MembershipSignUpModel initialize')

    // this.on('change:Session', (model, value, options) => {
    //   console.log(model, value, options)
    //   debugger
    //   docCookies.setItem('ATVSessionCookie', value.SessionID)
    // })
  }

  checkEmail(email) {
    console.log('MembershipSignUpModel signIn')
    // const headers = {
    //   StripeCustomerId: this.get('stripeCustomerId'),
    //   CustomerId: this.get('customerId'),
    //   StripeCardToken: stripeCardTokenID,
    // }

    const options = {
      url: [this.url, $.param({ Email: email })].join('?'),
      ajaxSync: true,
      context: this,
      dataType: 'json',
      wait: true,
      success: this.success,
      error: this.error,
    }
    console.log(options)
    this.fetch(options)
  }

  parse(resp) {
    console.log('MembershipSignUpModel parse')
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
    console.log('MembershipSignUpModel success')
    console.log(model, resp, options)
    // debugger
    model.set({
      checkProfileEmailSuccess: true,
      profile: resp,
    })
    console.log(model)
  }

  error(model, resp, options) {
    console.log('MembershipSignUpModel error')
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
          checkProfileEmailSuccess: false,
          message,
        })
      })
  }
}

export default MembershipSignUpModel
