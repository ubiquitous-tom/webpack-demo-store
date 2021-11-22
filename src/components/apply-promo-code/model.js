import { Model } from 'backbone'
import _ from 'underscore'
import { LocalStorage } from 'backbone.localstorage'
import { getLocalStorage } from 'backbone.localstorage/src/utils'
import Dispatcher from '../common/dispatcher'
import FlashMessage from '../shared/elements/flash-message/view'

class ApplyPromoCodeModel extends Model {

  get defaults() {
    return {
      localStorageID: 'atv-initializeapp',
    }
  }

  get url() {
    return '/applypromo'
  }

  initialize() {
    console.log('ApplyPromoCodeModel initialize')
    this.localStorage = new LocalStorage(this.get('localStorageID'))
    const store = getLocalStorage(this)
    // console.log(store.records)
    if (!_.isEmpty(store.records)) {
      const data = this.getStorageContent()
      // this.set(data)
      const session = _.pick(data, 'Session')
      this.Session = session.Session
    } else {
      // go back to signin
    }

    this.dispatcher = new Dispatcher()
    this.flashMessage = new FlashMessage({ dispatcher: this.dispatcher })
    this.model = new Model()
    // console.log(this)

    // this.sync = this.mySync
    this.listenTo(this, 'change', this.render)

    this.on('request', this.loadingStop)
    this.on('sync', this.success)
    this.on('error', this.error)
  }

  validate(attrs, options) {
    console.log('ApplyPromoCodeModel validate')
    console.log(attrs)
    // console.log(options)

    if (_.isEmpty(attrs.PromoCode.Code)) {
      console.log('please enter the code')
      return 'please enter the code'
    }

    const regexp = /^[a-zA-Z0-9-_]+$/;
    if (attrs.PromoCode.Code.search(regexp) === -1) {
      console.log('alphanumeric only')
      return 'alphanumeric only'
    }

    console.log('ApplyPromoCodeModel validate end')
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

  applyCode(code) {
    console.log('ApplyPromoCodeModel applyCode')
    this.loadingStart()
    console.log(this)
    const attributes = {
      Session: {
        SessionID: this.Session.SessionID,//'fa4dfd02-9870-44fd-8d31-037c57c8a627'//this.get('Session').SessionID
      },
      PromoCode: {
        Code: code
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
    console.log('ApplyPromoCodeModel success')
    console.log(model, resp, options)
    this.set({
      type: 'success',
      message: resp.message,
    })
    // this.showFlashMessage(model, resp, options)
    this.dispatcher.trigger('flashMessage:show', this.get('message'), this.get('type'))
  }

  error(model, resp, options) {
    console.log('ApplyPromoCodeModel error')
    console.log(model, resp, options)
    this.set({
      type: 'error',
      message: ''
    })
    this.showFlashMessage(model, resp, options)
  }

  showFlashMessage(model, resp, options) {
    resp
      .then(
        (response) => {
          console.log(response.responseJSON)
          if (!_.isEmpty(response.responseJSON)) {
            this.set('message', response.responseJSON.message)
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
        this.dispatcher.trigger('flashMessage:show', this.get('message'), this.get('type'))
      })
  }

  loadingStart() {
    console.log('ApplyPromoCodeModel loadingStart')
  }

  loadingStop(model, xhr, options) {
    console.log('ApplyPromoCodeModel loadingStop')
  }

  // getSessionID() {
  //   console.log('ApplyPromoCodeModel getSessionID')
  //   const sessionID = this.get('Session').SessionID
  //   console.log(sessionID)
  //   return sessionID
  // }

  getStorageContent() {
    console.log('ApplyPromoCodeModel getStorageContent')
    const id = this.localStorage._getItem(this.get('localStorageID'))
    // console.log(id)
    const name = this.localStorage._itemName(id)
    // console.log(name)
    const item = this.localStorage._getItem(name)
    // console.log(item)
    const storage = this.localStorage.serializer.deserialize(item)
    // console.log(storage)

    return storage
  }
}

export default ApplyPromoCodeModel
