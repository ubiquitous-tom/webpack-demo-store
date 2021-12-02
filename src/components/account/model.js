import _ from 'underscore'
import ATVModel from 'common/model';
import { LocalStorage } from 'backbone';
import { getLocalStorage } from 'backbone.localstorage/src/utils';

class AccountHomeModel extends ATVModel {

  get default() {
    return {
      localStorageID: 'atv-initializeapp',
    }
  }

  get url() {
    return '/currentmembership'
  }

  // preinitialize(attributes) {
  //   console.log('AccountHomeModel preinitialize')
  //   console.log(this, attributes)
  // }

  initialize(attributes) {
    console.log('AccountHomeModel initialize')
    // console.log(this.get('localStorageID'))
    // this.localStorage = new LocalStorage(this.get('localStorageID'))
    console.log(this, attributes)
    // const storage = getLocalStorage(this)
    // if (!_.isEmpty(storage.records)) {
    //   console.log('AccountHomeModel initialize NOT isEmpty')
    //   const data = this.getStorageContent(this.get('localStorageID'))
    //   this.set(data)
    //   console.log(this)
    // } else {
    //   // got back to login
    // }

    const params = {
      CustomerID: this.get('Customer').CustomerID,
    }
    // console.log(this, params, $.param(params))
    this.fetch({
      dataType: 'json',
      ajaxSync: true,
      wait: true,
      data: $.param(params),
      success: this.success,
      error: this.error,
    })
  }

  parse(resp) {
    console.log('AccountHomeModel parse')
    console.log(resp)
    // if (!_.isEmpty(resp)) {
    //   console.log('AccountHomeModel parse NOT isEmpty')
    //   this.set('currentMembership', resp)
    //   console.log(this)
    //   // this.sync('read', this)
    // } else {
    //   // something's wrong
    // }

    // return resp
  }

  success(model, resp, options) {
    console.log('AccountHomeModel success')
    console.log(model, resp, options)
    // debugger
    model.set({
      currentMembershipSuccess: true,
      currentMembership: resp,
    })
    console.log(model)
  }

  error(model, resp, options) {
    console.log('AccountHomeModel error')
    console.log(model, resp, options)
    // debugger
    let message = ''
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
        })
      })
  }

}

export default AccountHomeModel
