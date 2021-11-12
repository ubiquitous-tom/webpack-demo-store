import { Model, LocalStorage } from 'backbone'
import _ from 'underscore'
import { getLocalStorage } from 'backbone.localstorage/src/utils'
import ATVModel from 'common/model'

class AnnualPlanModel extends ATVModel {

  get defaults() {
    return {
      localStorageID: 'atv-initializeapp',
    }
  }

  initialize() {
    console.log('AnnualPlanModel initialize')
    this.localStorage = new LocalStorage(this.get('localStorageID'))
    const store = getLocalStorage(this)
    console.log(store.findAll())
    if (!_.isEmpty(this.localStorage.findAll())) {
      const data = this.getStorageContent()
      this.set(data)
    } else {
      // go back to signin
    }
  }

  getStorageContent() {
    console.log('AnnualPlanModel getStorageContent')
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

export default AnnualPlanModel
