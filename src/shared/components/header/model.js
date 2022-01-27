import { Model, LocalStorage } from 'backbone'
import _ from 'underscore'
import { getLocalStorage } from 'backbone.localstorage/src/utils'

class HeaderModel extends Model {
  get defaults() {
    return {
      localStorageID: 'atv-initializeapp',
    }
  }

  initialize() {
    console.log('HeaderModel initialize')
    this.localStorage = new LocalStorage(this.get('localStorageID'))
    // console.log(this, this.LocalStorage)
    const storage = getLocalStorage(this)
    // console.log(storage)
    if (!_.isEmpty(storage.records)) {
      const content = this.getStorageContent()
      this.set(content)
    } else {
      // go to login
    }
  }

  getStorageContent() {
    console.log('HeaderModel getStorageContent')
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

export default HeaderModel
