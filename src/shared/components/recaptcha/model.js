import { Model } from 'backbone'
import _ from 'underscore'

class ReCaptchaModel extends Model {
  get defaults() {
    return {
      v3Key: process.env.CAPTCHA_V3_KEY,
      v2Key: process.env.CAPTCHA_V2_KEY,
      captchaToken: '',
      captchaVersion: 'v3',
      isCaptchaV2: false,
      isCaptchaTested: false,
      generateCaptchaTokenSuccess: false,
      setCaptchaTokenSuccess: false,
      isCaptchaVerified: false,
      isCaptchaV2Rendered: false,
    }
  }

  // get url() {
  //   return 'https://www.google.com/recaptcha/api/siteverify'
  // }

  initialize() {
    console.log('ReCaptchaModel initialize')
    /* eslint-disable no-undef */
    console.log(grecaptcha)

    if (!_.isEmpty(process.env.CAPTCHA_V2_KEY)) {
      this.set({
        isCaptchaV2: true,
      })
    }

    // this.listenTo(this.model, 'change:captchaVerifySuccess', (model, value, options) => {
    //   console.log(model, value, options)
    //   debugger
    // })
  }

  // verify(captchaResponse) {
  //   console.log('ReCaptchaModel verify')
  //   const data = {
  //     secret: process.env.CAPTCHA_V2_SECRET,
  //     response: captchaResponse,
  //   }
  //   console.log($.param(data))
  //   this.fetch({
  //     // url: this.url,
  //     context: this,
  //     // type: 'POST',
  //     dataType: 'json',
  //     ajaxSync: true,
  //     wait: true,
  //     crossDomain: true,
  //     data: $.param(data),
  //     success: this.success,
  //     error: this.error,
  //   })
  // }

  // parse(resp) {
  //   console.log('ReCaptchaModel parse')
  //   console.log(resp)
  //   // return resp
  // }

  // success(model, resp, options) {
  //   console.log('ReCaptchaModel success')
  //   console.log(model, resp, options)
  //   // debugger
  //   model.set({
  //     reCaptchaVerifySuccess: true,
  //     reCaptchaVerify: resp,
  //     isCaptchaTested: true,
  //   })
  //   console.log(model)
  // }

  // error(model, resp, options) {
  //   console.log('ReCaptchaModel error')
  //   console.log(model, resp, options)
  //   debugger
  //   let message = ''
  //   /* eslint function-paren-newline: 0 */
  //   resp
  //     .then(
  //       (response) => {
  //         console.log(response.responseJSON, response.responseText)
  //         if (!_.isEmpty(response.responseJSON)) {
  //           message = response.responseJSON.message
  //           return message
  //         }
  //         if (!_.isEmpty(response.responseText)) {
  //           message = response.responseText
  //           return message
  //         }
  //         return message
  //       },
  //       (error) => {
  //         console.log(error.responseJSON, error.responseText)
  //         if (!_.isEmpty(error.responseJSON)) {
  //           message = error.responseJSON.error
  //           return message
  //         }
  //         if (!_.isEmpty(error.responseText)) {
  //           message = error.responseText
  //           return message
  //         }
  //         return message
  //       })
  //     .always(() => {
  //       debugger
  //       model.set({
  //         reCaptchaVerifySuccess: false,
  //         message,
  //         isCaptchaTested: true,
  //         captchaVersion: 'v2',
  //       })
  //     })
  // }
}

export default ReCaptchaModel
