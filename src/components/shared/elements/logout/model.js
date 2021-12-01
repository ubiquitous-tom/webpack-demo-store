import _ from 'underscore'
import { LocalStorage } from 'backbone'
import ATVModel from 'common/model'

class LogoutModel extends ATVModel {

  get defaults() {
    return {
      localStorageIDs: [
        // 'atv-initializeapp',
        'atv-stripekey',
        'atv-stripeplans',
        'atv-locale',
        'atv-plans-available'
      ]
    }
  }

  get url() {
    return '/logout'
  }

  initialize() {
    console.log('LogoutModel initialize')
    this.localStorage = new LocalStorage('atv-stripeplans')
    this.fetch({
      dataType: 'json',
      ajaxSync: true,
      wait: true,
    })

    this.on('change:isLoggedOut', this.clearStorageContent, this)
  }

  parse(resp) {
    console.log('LogoutModel parse')
    console.log(resp)
    if (resp.logout) {
      this.set('isLoggedOut', resp.logout)
    }
  }

  clearStorageContent() {
    if (!_.isEmpty(this.localStorage.records)) {
      _.each(this.get('localStorageIDs'), (localStorageID, key, collection) => {
        this.localStorage = new LocalStorage(localStorageID)
        if (!_.isEmpty(this.localStorage.records)) {
          this.set('id', this.localStorage.records[0])
          this.localStorage._clear()
          return true
        }
      }, this)
    }

    return false
  }
}

export default LogoutModel
