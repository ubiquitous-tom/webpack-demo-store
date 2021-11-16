import { Model } from 'backbone'
import _ from 'underscore'
import { LocalStorage } from 'backbone'
import { getLocalStorage } from 'backbone.localstorage/src/utils'
import ATVModel from '../../common/model'

class NavigationModel extends ATVModel {

  initialize() {
    console.log('NavigationModel initialize')
    this.localStorage = new LocalStorage('atv-initializeapp')
    const store = getLocalStorage(this)
    // console.log(store.records)
    if (!_.isEmpty(store.records)) {
      console.log('NavigationModel checkStorages NOT isEmpty')
      const data = this.getStorageContent('atv-initializeapp')
      // console.log(data)
      this.set(data)
    } else {
      // go back to signin
    }
  }

  // getStorageContent(localStorageID) {
  //   console.log('NavigationModel getStorageContent')
  //   const id = this.localStorage._getItem(localStorageID)
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

export default NavigationModel
