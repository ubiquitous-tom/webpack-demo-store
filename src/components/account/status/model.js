import _ from 'underscore'
// import { LocalStorage } from 'backbone'
// import { getLocalStorage } from 'backbone.localstorage/src/utils'
import ATVModel from 'common/model'

class AccountStatusModel extends ATVModel {
  // get defaults() {
  //   return {
  //     localStorageIDs: [
  //       'atv-initializeapp',
  //       'atv-stripekey',
  //       'atv-stripeplans',
  //       'atv-plans-available',
  //     ]
  //   }
  // }

  get url() {
    return '/acorn/plans/available?platform=stripe'
  }

  initialize() {
    console.log('AccountStatusModel initialize')
    console.log(this)
    // this.checkStorages()
    this.fetch({
      dataType: 'json',
      ajaxSync: true,
      wait: true,
      success: this.success,
      error: this.error,
    })
  }

  parse(response) {
    console.log('AccountStatusModel parse')
    console.log(response)
    // if (!_.isEmpty(response)) {
    //   console.log('AccountStatusModel parse noEmpty')
    //   const data = _.pick(response, 'data')
    //   console.log(data)
    //   this.set('plansAvailable', data.data)
    //   // this.getMonthlyToAnnualUpgrade()

    //   this.sync('read', this)
    // }
    // console.log(this)
    // return response
  }

  success(model, resp, options) {
    console.log('AccountStatusModel success')
    console.log(model, resp, options)
    // debugger
    model.set('plansAvailable', resp.data)
    // model.sync('read', model)
    // console.log(model)
  }

  error(model, resp, options) {
    console.log('AccountStatusModel error')
    console.log(model, resp, options)
    // debugger
    let message = ''
    /* eslint function-paren-newline: 0 */
    resp
      .then(
        (response) => {
          console.log(response.responseJSON, response.responseText)
          if (!_.isEmpty(response.responseJSON)) {
            message = response.responseJSON.message
          }
        },
        (error) => {
          console.log(error.responseJSON, error.responseText)
          if (!_.isEmpty(error.responseJSON)) {
            message = error.responseJSON.error
          }
        })
      .always(() => {
        model.set({
          currentMembershipSuccess: false,
          message,
        })
      })
  }

  // checkStorages() {
  //   console.log('AccountStatusModel checkStorages')
  //   _.each(this.get('localStorageIDs'), (val, key, list) => {
  //     // console.log(val, key, list)
  //     this.localStorage = new LocalStorage(val)
  //     const store = getLocalStorage(this)
  //     // console.log(store.records)
  //     if (!_.isEmpty(store.records)) {
  //       console.log('AccountStatusModel checkStorages NOT isEmpty')
  //       const data = this.getStorageContent(val)
  //       // console.log(data)
  //       this.set(data)
  //     } else {
  //       // go back to signin
  //     }
  //   })
  //   console.log(this)
  // }

  // getStorageContent(localStorageID) {
  //   console.log('AccountStatusModel getStorageContent')
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

export default AccountStatusModel
