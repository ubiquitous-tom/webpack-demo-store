import { Model } from 'backbone'
import _ from 'underscore'
// import { LocalStorage } from 'backbone.localstorage'

// import ATVLocale from './locale'
import InitializeApp from './models/initializedapp'
import PlansAvailable from './models/plans-available'
import StripeKey from './models/stripe-key'
import StripePlans from './models/stripe-plans'
import CurrentMembership from './models/currentmembership'

class ATVModel extends Model {

  get defaults() {
    return {
      localStorageID: 'atv-initializeapp'
    }
  }

  initialize() {
    console.log('ATVModel initialize')
    // this.locale = new ATVLocale()
    this.stripeKey = new StripeKey()
    this.plansAvailable = new PlansAvailable()
    this.stripePlans = new StripePlans()
    this.initializeApp = new InitializeApp()
    this.currentMembership = new CurrentMembership(this.initializeApp.attributes)
  }

  getStorageContent(localStorageID) {
    console.log('ATVModel getStorageContent')
    this.localStorageID = _.isEmpty(localStorageID) ? this.get('localStorageID') : localStorageID
    const id = this.localStorage._getItem(this.localStorageID)
    // console.log(id)
    const name = this.localStorage._itemName(id)
    console.log(name)
    const item = this.localStorage._getItem(name)
    // console.log(item)
    const storage = this.localStorage.serializer.deserialize(item)
    console.log(storage)

    return storage
  }

  updateModel() {
    console.log('ATVLocale updateModel')
    const storage = this.getStorageContent()
    console.log(storage)
    this.set(storage)
  }
}

export default ATVModel
