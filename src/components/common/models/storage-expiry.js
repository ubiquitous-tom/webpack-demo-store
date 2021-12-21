import { Model } from 'backbone'
import _ from 'underscore'
import { LocalStorage } from 'backbone.localstorage'
// import { getLocalStorage } from 'backbone.localstorage/src/utils'

class StorageExpiry extends Model {
  get defaults() {
    return {
      localStorageID: 'atv-storage-expiry',
      ttl: 300, // 1 hour
      localStorageIDs: [
        'atv-locale',
        'atv-stripekey',
        'atv-stripeplans',
        'atv-storage-expiry',
        'atv-plans-available',
      ],
    }
  }

  initialize() {
    console.log('StorageExpire initialize')
    this.localStorage = new LocalStorage(this.get('localStorageID'))
    if (!_.isEmpty(this.localStorage.records)) {
      console.log('StorageExpire initialize exist')
      const expiryStorage = this.getStorageContent(this.get('localStorageID'))
      const now = Date.now()
      if (new Date(now) > new Date(expiryStorage.expiry)) {
        console.log('StorageExpire initialize exist expired so clear localstorage')
        this.localStorage._clear()
        window.location.reload()
      }
    } else {
      console.log('StorageExpire initialize NOT exist so clear localstorage LEGACY code')
      this.localStorage._clear()
      _.each(this.get('localStorageIDs'), (localStorageID) => {
        const localStorage = new LocalStorage(localStorageID)
        localStorage._clear()
      })
      let expiryTime = Date.now()
      expiryTime += (this.get('ttl') * 1000)
      this.set('expiry', expiryTime)
      this.localStorage.create(this)
    }
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

export default StorageExpiry
