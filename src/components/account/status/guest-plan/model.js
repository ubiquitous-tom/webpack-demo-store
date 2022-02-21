// import { LocalStorage } from 'backbone'
// import _ from 'underscore'
// import { getLocalStorage } from 'backbone.localstorage/src/utils'
import ATVModel from 'core/model'
import StripePlans from 'core/models/stripe-plans'

class GuestPlanModel extends ATVModel {
  initialize() {
    console.log('GuestPlanModel initialize')
    // this.localStorage = new LocalStorage('atv-stripeplans')
    // const store = getLocalStorage(this)
    // // console.log(store)
    // if (!_.isEmpty(store.records)) {
    //   const data = this.getStorageContent('atv-stripeplans')
    //   // console.log(data)
    //   this.set(data)
    // } else {
    this.stripePlans = new StripePlans()
    this.stripePlans.on('change:stripePlans', (model, value) => {
      console.log(model, value)
      this.set({
        stripePlans: value,
        stripePlansCountry: model.get('stripePlansCountry'),
        stripePlansLang: model.get('stripePlansLang'),
      })
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
    // }
  }

  annualPerMonthPricing() {
    console.log('GuestPlanModel getMonthlyPricing')
    const pricing = (this.get('stripePlansCountry') === 'US')
      ? (Math.floor((this.get('annualStripePlan').SubscriptionAmount / 12) * 100) / 100).toFixed(2)
      : this.get('monthlyStripePlan').SubscriptionAmount
    console.log(pricing)
    // this.model.set('annualPerMonthPricing', pricing)
    return pricing
  }
}

export default GuestPlanModel
