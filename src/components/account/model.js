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

  initialize() {
    console.log('AccountHomeModel initialize')
    console.log(this.get('localStorageID'))
    this.localStorage = new LocalStorage(this.get('localStorageID'))
    console.log(this)
    const storage = getLocalStorage(this)
    if (!_.isEmpty(storage.records)) {
      console.log('AccountHomeModel initialize NOT isEmpty')
      const data = this.getStorageContent(this.get('localStorageID'))
      this.set(data)
      console.log(this)
    } else {
      // got back to login
    }

    const params = {
      CustomerID: this.get('Customer').CustomerID,
    }
    console.log(this, params, $.param(params))
    this.fetch({
      dataType: 'json',
      ajaxSync: true,
      wait: true,
      data: $.param(params)
    })
  }

  parse(resp) {
    console.log('AccountHomeModel parse')
    console.log(resp)
    if (!_.isEmpty(resp)) {
      console.log('AccountHomeModel parse NOT isEmpty')
      this.set('currentMembership', resp)
      console.log(this)
      // this.sync('read', this)
    } else {
      // something's wrong
    }

    return resp
  }

}

export default AccountHomeModel
