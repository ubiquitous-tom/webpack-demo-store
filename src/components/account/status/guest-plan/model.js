// import { LocalStorage } from 'backbone'
// import _ from 'underscore'
import { LocalStorage } from 'backbone'
import _ from 'underscore'
import { getLocalStorage } from 'backbone.localstorage/src/utils'
import ATVModel from 'common/model'
import StripePlans from 'common/models/stripe-plans'

class GuestPlanModel extends ATVModel {
  initialize() {
    console.log('GuestPlanModel initialize')
    this.localStorage = new LocalStorage('atv-stripeplans')
    const store = getLocalStorage(this)
    // console.log(store)
    if (!_.isEmpty(store.records)) {
      const data = this.getStorageContent('atv-stripeplans')
      // console.log(data)
      this.set(data)
    } else {
      this.stripePlans = new StripePlans()
      this.stripePlans.on('change:stripePlans', (model, value) => {
        console.log(model, value)
        this.set('stripePlans', value)
        // debugger
      })

      this.stripePlans.on('change:annualStripePlan', (model, value) => {
        console.log(model, value)
        this.set('annualStripePlan', value)
        // debugger
      })

      this.stripePlans.on('change:monthlyStripePlan', (model, value) => {
        console.log(model, value)
        this.set('monthlyStripePlan', value)
        // debugger
      })
    }
  }
}

export default GuestPlanModel
