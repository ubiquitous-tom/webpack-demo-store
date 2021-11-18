import { Model, LocalStorage } from 'backbone'
import _ from 'underscore'
import { getLocalStorage } from 'backbone.localstorage/src/utils'
import ATVModel from 'common/model'

class AnnualPlanModel extends ATVModel {

  get defaults() {
    return {
      localStorageIDs: [
        'atv-stripeplans',
        // 'atv-initializeapp',
        // 'atv-plans-available',
      ],
    }
  }

  initialize() {
    console.log('AnnualPlanModel initialize')
    console.log(this)
    _.each(this.get('localStorageIDs'), (localStorageID, key, collection) => {
      this.localStorage = new LocalStorage(localStorageID)
      const store = getLocalStorage(this)
      // console.log(store)
      if (!_.isEmpty(store.records)) {
        const data = this.getStorageContent(localStorageID)
        // console.log(data)
        this.set(data)
      } else {
        // go back to signin
      }
    })

    this.set({
      renewalDate: this.getRenewalDate(),
      annualPerMonthPricing: this.annualPerMonthPricing(),
    })
  }

  // getStorageContent() {
  //   console.log('AnnualPlanModel getStorageContent')
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

  getMonthlyToAnnualUpgradeInfo() {
    console.log('AnnualPlanModel getMonthlyToAnnualUpgrade')
    const type = 'upgrade'
    const from_frequency = 'annual'
    const to_frequency = 'monthly'
    const plansAvailable = this.get('plansAvailable')
    console.log(plansAvailable)
    // _.each(plansAvailable, (plan, key, collection) => {
    //   console.log(plan.type)
    //   if (plan.type === type) {
    //     console.log(plan.from_frequency, plan.to_frequency)
    //     if (plan.from_frequency === from_frequency && plan.to_frequency === to_frequency) {
    //       console.log(plan)
    //       // return plan
    //       this.set('currentUpgradePlan', plan)
    //     }
    //   }
    // })
    return []
  }

  getRenewalDate() {
    console.log('AnnualPlanModel getRenewal')
    let date = new Date(this.get('Membership').NextBillingDateAsLong)
    let renewalDate = this.formatDate(date)
    console.log(renewalDate)
    // this.model.set('renewalDate', renewalDate)
    return renewalDate
  }

  annualPerMonthPricing() {
    console.log('AnnualPlanModel getMonthlyPricing')
    const pricing = (Math.floor((this.get('Membership').SubscriptionAmount / 12) * 100) / 100).toFixed(2)
    console.log(pricing)
    // this.model.set('annualPerMonthPricing', pricing)
    return pricing
  }

  formatDate(d) {
    //get the month
    let month = d.getMonth()
    //get the day
    //convert day to string
    let day = d.getDate().toString()
    //get the year
    let year = d.getFullYear()

    //pull the last two digits of the year
    year = year.toString().substr(-2)

    //increment month by 1 since it is 0 indexed
    //converts month to a string
    month = (month + 1).toString()

    //if month is 1-9 pad right with a 0 for two digits
    if (month.length === 1) {
      month = "0" + month
    }

    //if day is between 1-9 pad right with a 0 for two digits
    if (day.length === 1) {
      day = "0" + day
    }

    //return the string "MMddyy"
    return [month, day, year].join('/')
  }
}

export default AnnualPlanModel
