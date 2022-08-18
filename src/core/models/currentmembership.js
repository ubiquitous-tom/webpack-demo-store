import { Model, LocalStorage } from 'backbone'
import _ from 'underscore'
import { getLocalStorage } from 'backbone.localstorage/src/utils'

class CurrentMembership extends Model {
  get url() {
    return '/currentmembership'
  }

  initialize(options) {
    console.log('CurrentMembership initialize')
    console.log(this, options)
    this.localStorage = new LocalStorage(this.get('localStorageID'))
    // console.log(this.localStorage)
    const store = getLocalStorage(this)
    console.log(store)
    if (_.isEmpty(store.records)) {
      console.log('CurrentMembership initialize fetch')
      const params = {
        CustomerID: options.CustomerID,
      }
      // console.log(this, params, $.param(params))
      this.fetch({
        dataType: 'json',
        ajaxSync: true,
        wait: true,
        data: $.param(params),
      })
    }
  }

  parse(resp) {
    console.log('CurrentMembership parse')
    if (!_.isEmpty(resp)) {
      console.log('CurrentMembership parse NOT isEmpty')
      this.set(resp)
      // this.sync('read', this)
    } else {
      // something's wrong
    }

    return resp
  }
}

export default CurrentMembership
