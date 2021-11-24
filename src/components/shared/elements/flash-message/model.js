import { Model } from 'backbone'
import _ from 'underscore'

import BrowserStorage from 'backbone.browserStorage'

class FlashMessageModel extends Model {

  get defaults() {
    return {
      sessionStorageID: 'atv-flashmessage'
    }
  }

  initialize() {
    this.sessionStorage = new BrowserStorage.session(this.get('sessionStorageID'))
  }

  addFlashMessage(message, type) {
    this.set({
      message: message,
      type: type,
    })
    this.sessionStorage.create(this)
  }

  removeFlashMessage() {
    if (!_.isEmpty(this.sessionStorage.records)) {
      _.each(this.sessionStorage.records, (record, key, collection) => {
        this.set('id', record)
        console.log(this.sessionStorage.find(this))
        // this.sessionStorage.destroy(this)
        this.sessionStorage._clear()
      })
    }
  }

  getStorageContent() {
    if (!_.isEmpty(this.sessionStorage.records)) {
      _.each(this.sessionStorage.records, (record, key, collection) => {
        this.set('id', record)
        const flashMessage = this.sessionStorage.find(this)
        this.set({
          message: flashMessage.message,
          type: flashMessage.type,
        })
        return true
      })
    }

    return false
  }
}

export default FlashMessageModel
