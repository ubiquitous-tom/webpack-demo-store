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

    if (_.isEmpty(attributes.promoCode)) {
      console.log('please enter promo code')
      return 'please enter promo code'
    }
  }

  // submit(promoCode) {
  //   console.log('ApplyGiftCodeModel submit')
  //   const options = {
  //     url: [this.url, $.param({ Code: promoCode })].join('?'),
  //     context: this,
  //     dataType: 'json',
  //     ajaxSync: true,
  //     wait: true,
  //     success: this.success,
  //     error: this.error,
  //   }
  //   console.log(options)
  //   debugger
  //   this.fetch(options)
  // }

  applyCode(code) {
    console.log('ApplyPromoCodeModel applyCode')
    console.log(this)
    const attributes = {
      Session: {
        SessionID: this.model.get('sessionID'),
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
    debugger
    this.save(attributes, options)
  }

  success(model, resp, options) {
    console.log('ApplyPromoCodeModel success')
    console.log(model, resp, options)

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
    /* eslint function-paren-newline: 0 */
    resp
      .then(
        (response) => {
          console.log(response.responseJSON)
          if (!_.isEmpty(response.responseJSON)) {
            model.set({
              applyGiftCodeSuccess: false,
              type: 'error',
              message: response.responseJSON.message,
            })
          }
        },
        (error) => {
          console.log(error.responseJSON)
          if (!_.isEmpty(error.responseJSON)) {
            model.set({
              applyGiftCodeSuccess: false,
              type: 'error',
              message: error.responseJSON.error,
            })
          }
        })
  }
}

export default ApplyGiftCodeModel
