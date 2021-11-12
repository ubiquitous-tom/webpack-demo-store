import { Model, LocalStorage } from 'backbone'
import _ from 'underscore'
import { getLocalStorage } from 'backbone.localstorage/src/utils'

class StripeKey extends Model {

  get defaults() {
    return {
      localStorageID: 'atv-stripekey',
    }
  }

  get url() {
    return '/stripekey'
  }

  initialize() {
    console.log('StripeKey initialize')
    this.localStorage = new LocalStorage(this.get('localStorageID'))
    // console.log(this.localStorage)
    const store = getLocalStorage(this)
    console.log(store)
    if (_.isEmpty(store.records)) {
      console.log('StripeKey initialize fetch')
      this.fetch({
        ajaxSync: true
      })
    }
  }

  parse(resp) {
    console.log('StripeKey parse')
    if (!_.isEmpty(resp)) {
      console.log('StripeKey parse NOT isEmpty')
      this.set(resp)
      this.sync('create', this)
    } else {
      // something's wrong
    }

    return resp
  }
}

export default StripeKey
