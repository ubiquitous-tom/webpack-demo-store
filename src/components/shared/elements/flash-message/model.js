import { Model } from 'backbone'
import _ from 'underscore'

import BrowserStorage from 'backbone.browserStorage'

class FlashMessageModel extends Model {
  get defaults() {
    return {
      sessionStorageID: 'atv-flashmessage',
    }
  }

  initialize() {
    /* eslint new-cap: 0 */
    this.sessionStorage = new BrowserStorage.session(this.get('sessionStorageID'))
  }

  addFlashMessage(message, type) {
    this.set({
      message,
      type,
    })
    this.sessionStorage.create(this)
  }

  removeFlashMessage() {
    if (!_.isEmpty(this.sessionStorage.records)) {
      _.each(this.sessionStorage.records, (record, key, collection) => {
        this.set('id', record)
        console.log(this.sessionStorage.find(this))
        // this.sessionStorage.destroy(this)
        /* eslint no-underscore-dangle: 0 */
        this.sessionStorage._clear()
        return collection
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
        return collection
      })
    }

    return false
  }
}

export default FlashMessageModel
