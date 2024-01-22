import { Model } from 'backbone'
import _ from 'underscore'
import StripeKey from 'core/models/stripe-key'

class StripeFormModel extends Model {
  get defaults() {
    return {
      captchaVersion: 'v3',
      csrfValidationSuccess: true,
      captchaValidationV2Success: true,
      captchaValidationV3Success: true,
    }
  }

  get url() {
    return '/stripecard'
  }

  initialize() {
    console.log('StripeFormModel initialize')
    this.stripeKey = new StripeKey()
    // console.log(this.stripeKey)

    this.stripeKey.on('change:StripeKey', (model, value) => {
      // console.log(model, value)
      // debugger
      this.set('stripeKey', value)
    })
  }

  addNewStripeCard(data) {
    const stripeCard = new Model()
    const {
      stripeCardTokenID,
      captchaToken,
      captchaVersion,
      csrfToken,
    } = data
    const headers = {
      StripeCustomerId: this.get('stripeCustomerId'),
      CustomerId: this.get('customerId'),
      StripeCardToken: stripeCardTokenID,
    }

    const attributes = {
      country: this.get('country'),
      captcha_token: captchaToken,
      captcha_version: captchaVersion,
      csrf_token: csrfToken,
    }

    const options = {
      url: this.url,
      context: this,
      dataType: 'json',
      ajaxSync: true,
      wait: true,
      headers,
      success: this.success,
      error: this.error,
    }

    console.log(attributes, options)
    debugger
    stripeCard.save(attributes, options)
  }

  success(model, resp, options) {
    console.log('StripeFormModel success')
    console.log(model, resp, options)
    debugger
    this.set({
      addNewStripeCardSuccess: true,
      flashMessage: {
        type: 'success',
        message: 'CREDIT-CARD-UPDATED',
        interpolationOptions: {},
      },
    })
  }

  error(model, resp, options) {
    console.log('StripeFormModel error')
    console.log(model, resp, options)
    debugger
    const captchaVersion = this.get('captchaVersion')
    let message = 'ERR-PROCESS-REQUEST'
    let csrfValidationSuccess = true
    let captchaValidationV3Success = true
    let captchaValidationV2Success = true
    /* eslint function-paren-newline: 0 */
    resp
      .then(
        (response) => {
          console.log(response.responseJSON, response.responseText)
          if (!_.isEmpty(response.responseJSON)) {
            message = response.responseJSON.message || response.responseJSON.error
            console.log(message)
            return message
          }
          return message
        },
        (error) => {
          console.log(error.responseJSON, error.responseText)
          if (!_.isEmpty(error.responseJSON)) {
            message = error.responseJSON.message || error.responseJSON.error
            console.log(message)
            if (message.toLocaleLowerCase().includes('csrf')) {
              csrfValidationSuccess = false
            }
            if (message.toLocaleLowerCase().includes('captcha')) {
              if (captchaVersion === 'v3') {
                captchaValidationV3Success = false
              } else {
                captchaValidationV2Success = false
              }
            }
            return message
          }
          if (!_.isEmpty(error.responseText)) {
            // TODO: Remove in phase 2. Update to use error message from Stripe API.
            message = 'Sorry, we are unable to process your payment right now. Please contact support@acorn.tv for help.'
            // message = error.statusText
            return message
          }
          return message
        })
      .always(() => {
        options.context.set({
          csrfValidationSuccess,
          captchaValidationV3Success,
          captchaValidationV2Success,
          addNewStripeCardSuccess: false,
          flashMessage: {
            type: 'error',
            message,
            interpolationOptions: {},
          },
        })
        console.log(options.context.get('flashMessage').message, options.context.get('flashMessage').type)
      })
  }
}

export default StripeFormModel
