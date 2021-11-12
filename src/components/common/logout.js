import { Model } from 'backbone'
import _ from 'underscore'
import { getLocalStorage, LocalStorage } from 'backbone'

class Logout extends Model {

  get defaults() {
    return {
      localStorageIDs: [
        'atv-initializeapp',
        'atv-stripeplans',
        'atv-local',
        'atv-plans-available'
      ]
    }
  }

  initialize() {
    console.log('Logout initialize')
    this.localStorage = new LocalStorage('atv-initializeapp')
    this.fetch()
  }

  parse(resp) {
    console.log('Logout parse')
    if (!_.isEmpty(resp.logout)) {

    }
  }

  checkStorages() {
    console.log('Logout checkStorages')
    // _.each(this.get('localStorageIDs'), (val, key, list) => {
    //   // console.log(val, key, list)
    //   this.localStorage = new LocalStorage(val)
    //   const store = getLocalStorage(this)
    //   // console.log(store.records)
    //   if (!_.isEmpty(store.records)) {
    //     console.log('AccountStatusModel checkStorages NOT isEmpty')
    //     const data = this.deleteStorageContent(val)
    //     // console.log(data)
    //     this.set(data)
    //   } else {
    //     // go back to signin
    //   }
    // })
    // console.log(this)

    this.localStorage._clear()
  }

  deleteStorageContent(localStorageID) {
    console.log('Logout getStorageContent')
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

export default Logout
