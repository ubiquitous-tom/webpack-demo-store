import { Model } from 'backbone'
import _ from 'underscore'
// import { LocalStorage } from 'backbone.localstorage'
// import { getLocalStorage } from 'backbone.localstorage/src/utils'
// import FlashMessage from '../shared/elements/flash-message'

class ApplyPromoCodeModel extends Model {
  // get defaults() {
  //   return {
  //     localStorageID: 'atv-initializeapp',
  //   }
  // }

  get url() {
    return '/applypromo'
  }

  initialize() {
    console.log('ApplyPromoCodeModel initialize')
    // console.log(this)
    // this.sync = this.mySync
    // this.listenTo(this, 'change', this.render)
    this.model = new Model()
    this.on('request', this.loadingStop)
    // this.on('sync', this.success)
    // this.on('error', this.error)
  }

  /* eslint consistent-return: 0 */
  /* eslint no-unused-vars: 0 */
  validate(attrs, options) {
    // console.log('ApplyPromoCodeModel validate')
    // console.log(attrs)
    // console.log(options)

    if (_.isEmpty(attrs.PromoCode.Code)) {
      console.log('Please make sure there are no illegal characters (including spaces) in the promo code.')
      return 'Please make sure there are no illegal characters (including spaces) in the promo code.'
    }

    const regexp = /^[a-zA-Z0-9-_]+$/
    if (attrs.PromoCode.Code.search(regexp) === -1) {
      console.log('Only Alphanumeric characters. Space is not allowed.')
      return 'Only Alphanumeric characters. Space is not allowed.'
    }

    // console.log('ApplyPromoCodeModel validate end')
  }

  parse(response) {
    console.log('ApplyPromoCodeModel parse')
    console.log(response)
    return response
  }

  // mySync(method, model, options) {
  //   console.log('ApplyPromoCodeModel mySync')
  //   console.log(method, model, options)
  //   options.ajaxSync = true
  //   // options.emulateJSON = true
  //   // switch (method) {
  //   //   case 'patch':
  //   //   case 'update':
  //   //     method = 'create'
  //   //     break;
  //   // }

  //   // const myModel = {
  //   //   Session: {
  //   //     SessionID: '1c7cef3b-2ca5-4843-ba77-1231d0a091ef'//this.get('Session').SessionID
  //   //   },
  //   //   PromoCode: model.get('Promocode')
  //   // }

  //   console.log(method, model, options)
  //   return Backbone.sync(method, model, options)
  // }

  applyCode(code, sessionID) {
    console.log('ApplyPromoCodeModel applyCode')
    this.loadingStart()
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
    const promoMessagePrefix = 'Promo applied!'
    const promoMessageSuffix = 'Your account has been updated'
    model.set({
      applyPromoCodeSuccess: true,
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
              applyPromoCodeSuccess: false,
              type: 'error',
              message: response.responseJSON.message,
            })
          }
        },
        (error) => {
          console.log(error.responseJSON)
          if (!_.isEmpty(error.responseJSON)) {
            model.set({
              applyPromoCodeSuccess: false,
              type: 'error',
              message: error.responseJSON.error,
            })
          }
        })
      .always(() => {
        console.log(model.get('message'), model.get('type'))
        model.loadingStop()
      })
  }

  loadingStart() {
    console.log('ApplyPromoCodeModel loadingStart')
  }

  loadingStop() {
    console.log('ApplyPromoCodeModel loadingStop')
  }

  // getStorageContent() {
  //   console.log('ApplyPromoCodeModel getStorageContent')
  //   const id = this.localStorage._getItem(this.get('localStorageID'))
  //   // console.log(id)
  //   const name = this.localStorage._itemName(id)
  //   // console.log(name)
  //   const item = this.localStorage._getItem(name)
  //   // console.log(item)
  //   const storage = this.localStorage.serializer.deserialize(item)
  //   // console.log(storage)

  //   return storage
  // }
}

export default ApplyPromoCodeModel
