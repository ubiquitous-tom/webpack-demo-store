import { Model } from 'backbone'
import _ from 'underscore'
import { LocalStorage } from 'backbone'
import { getLocalStorage } from 'backbone.localstorage/src/utils'

class AccountStatusModel extends Model {

  get defaults() {
    return {
      localStorageIDs: [
        'atv-initializeapp',
        'atv-stripekey',
        'atv-stripeplans',
        'atv-plans-available',
      ]
    }
  }

  initialize() {
    console.log('AccountStatusModel initialize')
    this.checkStorages()
  }

  checkStorages() {
    console.log('AccountStatusModel checkStorages')
    _.each(this.get('localStorageIDs'), (val, key, list) => {
      // console.log(val, key, list)
      this.localStorage = new LocalStorage(val)
      const store = getLocalStorage(this)
      // console.log(store.records)
      if (!_.isEmpty(store.records)) {
        console.log('AccountStatusModel checkStorages NOT isEmpty')
        const data = this.getStorageContent(val)
        // console.log(data)
        this.set(data)
      } else {
        // go back to signin
      }
    })
    // console.log(this)
  }

  getStorageContent(localStorageID) {
    console.log('AccountStatusModel getStorageContent')
    const id = this.localStorage._getItem(localStorageID)
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

export default AccountStatusModel
