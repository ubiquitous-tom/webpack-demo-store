import { Model } from 'backbone'
import _ from 'underscore'

import FlashMessage from 'shared/elements/flash-message'
// import PlansAvailable from './models/plans-available'

class ATVModel extends Model {
  get defaults() {
    return {
      localStorageID: 'atv-initializeapp',
    }
  }

  initialize() {
    console.log('ATVModel initialize')
    // console.log(this)
    // this.plansAvailable = new PlansAvailable()

    this.flashMessage = new FlashMessage()
    this.flashMessage.model.getStorageContent()
    if (this.flashMessage.model.has('id')) {
      // console.log(this.flashMessage.model.get('message'), this.flashMessage.model.get('type'))
      this.flashMessage.onFlashMessageShow(this.flashMessage.model.get('message'), this.flashMessage.model.get('type'))
    }
  }

  getStorageContent(localStorageID) {
    console.log('ATVModel getStorageContent')
    this.localStorageID = _.isEmpty(localStorageID) ? this.get('localStorageID') : localStorageID
    const id = this.localStorage._getItem(this.localStorageID)
    // console.log(id)
    const name = this.localStorage._itemName(id)
    console.log(name)
    const item = this.localStorage._getItem(name)
    // console.log(item)
    const storage = this.localStorage.serializer.deserialize(item)
    console.log(storage)

    return storage
  }

  updateModel(localStorageID, context) {
    console.log('ATVModel updateModel')
    /* eslint no-param-reassign: 0 */
    context = !_.isEmpty(context) ? context : this
    context.localStorageID = _.isEmpty(localStorageID) ? context.get('localStorageID') : localStorageID
    // console.log(context.localStorageID)
    const storage = this.getStorageContent(context.localStorageID)
    console.log(storage)
    // console.log(context)
    context.set(storage)
  }
}

export default ATVModel
