import { Model } from 'backbone'
import _ from 'underscore'

class ApplyGiftCodeModel extends Model {
  get url() {
    return '/applypromo'
  }

  initialize() {
    console.log('ApplyGiftCodeModel ApplyGiftCodeModel')
  }

  parse(resp) {
    console.log('ApplyGiftCodeModel parse')
    console.log(resp)
  }

  /* eslint consistent-return: 0 */
  validate(attributes, options) {
    console.log('ApplyGiftCodeModel validate')
    console.log(attributes, options)

    if (_.isEmpty(attributes.PromoCode.Code)) {
      console.log('please enter promo code')
      return 'CODE-INVALID' // 'please enter promo code'
    }
  }

  applyCode(sessionID, code) {
    console.log('ApplyPromoCodeModel applyCode')
    console.log(this)
    const attributes = {
      Session: {
        SessionID: sessionID,
      },
      PromoCode: {
        Code: code,
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
    // debugger
    this.save(attributes, options)
  }

  success(model, resp, options) {
    console.log('ApplyPromoCodeModel success')
    console.log(model, resp, options)
    // debugger
    const { message } = resp // Your Promotion Code has been applied!
    // If `TrialEnabled` is `false`, it is a gift code
    // Or
    // If `TrialEnabled` is `null` and the `MembershipTerm` is `12`
    // and `MembershipTermType` is`MONTH`, it is a gift code
    // const promoMessagePrefix = 'Promo applied!'
    // const promoMessageSuffix = 'Your account has been updated'
    model.set({
      applyGiftCodeSuccess: true,
      type: 'success',
      message,
    })
  }

  error(model, resp, options) {
    console.log('ApplyPromoCodeModel error')
    console.log(model, resp, options)
    console.log(this)
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
          applyGiftCodeSuccess: false,
          flashMessage: {
            type: 'error',
            message,
            interpolationOptions: {},
          },
        })
        console.log(model.get('flashMessage').message, model.get('flashMessage').type)
      })
  }
}

export default ApplyGiftCodeModel
