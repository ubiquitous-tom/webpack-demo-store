import { Model, LocalStorage } from 'backbone'
import _ from 'underscore'
import { getLocalStorage } from 'backbone.localstorage/src/utils'
import ATVModel from 'common/model'

class AccountInfoModel extends ATVModel {

  get defaults() {
    return {
      localStorageID: 'atv-initializeapp',
    }
  }

  initialize() {
    console.log('AccountInfoModel initialize')
    this.localStorage = new LocalStorage(this.get('localStorageID'))
    console.log(this)
    const storage = getLocalStorage(this)
    if (!_.isEmpty(storage.records)) {
      const data = this.getStorageContent()
      this.set(data)
    } else {
      // got back to login
    }
  }

  getStorageContent() {
    console.log('AccountInfoModel getStorageContent')
    const id = this.localStorage._getItem(this.get('localStorageID'))
    // console.log(id)
    const name = this.localStorage._itemName(id)
    console.log(name)
    const item = this.localStorage._getItem(name)
    // console.log(item)
    const storage = this.localStorage.serializer.deserialize(item)
    console.log(storage)

    return storage
  }
}

export default AccountInfoModel
