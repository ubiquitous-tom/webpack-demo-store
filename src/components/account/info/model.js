import { Model, LocalStorage } from 'backbone'
import _ from 'underscore'
import { getLocalStorage } from 'backbone.localstorage/src/utils'
import ATVModel from 'common/model'

class AccountInfoModel extends ATVModel {

  // get defaults() {
  //   return {
  //     localStorageID: 'atv-initializeapp',
  //   }
  // }

  // get url() {
  //   return '/currentmembership'
  // }

  initialize() {
    console.log('AccountInfoModel initialize')
    // this.localStorage = new LocalStorage(this.get('localStorageID'))
    console.log(this)
    // const storage = getLocalStorage(this)
    // if (!_.isEmpty(storage.records)) {
    //   const data = this.getStorageContent(this.get('localStorageID'))
    //   this.set(data)
    //   // this.getCurrentMembership()
    // } else {
    //   // got back to login
    // }

    // const params = {
    //   CustomerID: this.get('Customer').CustomerID,
    // }
    // console.log(this, params, $.param(params))
    // this.fetch({
    //   dataType: 'json',
    //   ajaxSync: true,
    //   wait: true,
    //   data: $.param(params)
    // })
  }

  // parse(resp) {
  //   console.log('AccountInfoModel parse')
  //   console.log(resp)
  //   if (!_.isEmpty(resp)) {
  //     console.log('AccountInfoModel parse NOT isEmpty')
  //     this.set('currentMembership', resp)
  //     console.log(this)
  //     // this.sync('read', this)
  //   } else {
  //     // something's wrong
  //   }

  //   return resp
  // }

  getCurrentMembership() {
    console.log('AccountInfoModel getCurrentMembership')
    const params = {
      CustomerID: this.get('Customer').CustomerID,
    }
    console.log(this, params, $.param(params))
    this.fetch({
      dataType: 'json',
      ajaxSync: true,
      wait: true,
      method: 'GET',
      data: $.param(params)
    })
  }

  // getStorageContent() {
  //   console.log('AccountInfoModel getStorageContent')
  //   const id = this.localStorage._getItem(this.get('localStorageID'))
  //   // console.log(id)
  //   const name = this.localStorage._itemName(id)
  //   console.log(name)
  //   const item = this.localStorage._getItem(name)
  //   // console.log(item)
  //   const storage = this.localStorage.serializer.deserialize(item)
  //   console.log(storage)

  //   return storage
  // }
}

export default AccountInfoModel
