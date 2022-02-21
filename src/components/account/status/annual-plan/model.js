// import { LocalStorage } from 'backbone'
// import _ from 'underscore'
// import { getLocalStorage } from 'backbone.localstorage/src/utils'
import ATVModel from 'core/model'
import StripePlans from 'core/models/stripe-plans'

class AnnualPlanModel extends ATVModel {
  initialize() {
    console.log('AnnualPlanModel initialize')
    console.log(this)
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

    // Too early to call this function here.
    // this.set({
    //   // renewalDate: this.getRenewalDate(),
    //   annualPerMonthPricing: this.annualPerMonthPricing(),
    // })
  }

  getMonthlyToAnnualUpgradeInfo() {
    console.log('AnnualPlanModel getMonthlyToAnnualUpgrade')
    // const type = 'upgrade'
    // const from_frequency = 'annual'
    // const to_frequency = 'monthly'
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
    // const date = new Date(this.get('Membership').NextBillingDateAsLong)
    // const renewalDate = this.formatDate(date)
    const renewalDate = this.get('Membership').NextBillingDate || this.get('Membership').ExpirationDate
    // console.log(renewalDate)
    // this.model.set('renewalDate', renewalDate)
    // return renewalDate
    const renewalDateObj = Date.parse(renewalDate)
    console.log(renewalDateObj)
    const dynamicDate = new Date(renewalDateObj)
    console.log(`${this.get('stripePlansLang')}-${this.get('stripePlansCountry')}`)
    return dynamicDate.toLocaleDateString(
      `${this.get('stripePlansLang')}-${this.get('stripePlansCountry')}`,
      {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
    )
  }

  annualPerMonthPricing() {
    console.log('AnnualPlanModel getMonthlyPricing')
    const pricing = (this.get('stripePlansCountry') === 'US')
      ? (Math.floor((this.get('Membership').SubscriptionAmount / 12) * 100) / 100).toFixed(2)
      : this.get('monthlyStripePlan').SubscriptionAmount
    console.log(pricing)
    this.set('annualPerMonthPricing', pricing)
    return pricing
  }

  formatDate(d) {
    const dynamicDate = new Date()
    // get the month
    let month = d.getMonth()
    dynamicDate.setMonth(month)
    // get the day
    // convert day to string
    let day = d.getDate().toString()
    dynamicDate.setDate(day)
    // get the year
    let year = d.getFullYear()

    dynamicDate.setFullYear(year)
    // pull the last two digits of the year
    year = year.toString().substr(-2)

    // increment month by 1 since it is 0 indexed
    // converts month to a string
    month = (month + 1).toString()

    // if month is 1-9 pad right with a 0 for two digits
    if (month.length === 1) {
      month = `0${month}`
    }

    // if day is between 1-9 pad right with a 0 for two digits
    if (day.length === 1) {
      day = `0${day}`
    }

    // return the string "MMddyy"
    // return [month, day, year].join('/')

    // US English uses month-day-year order
    console.log('US English uses month-day-year order', dynamicDate.toLocaleDateString('en-US'))

    // British English uses day-month-year order
    console.log('British English uses day-month-year order', dynamicDate.toLocaleDateString('en-GB'))

    console.log(`${this.get('stripePlansLang')}-${this.get('stripePlansCountry')}`)
    return dynamicDate.toLocaleDateString(`${this.get('stripePlansLang')}-${this.get('stripePlansCountry')}`)
  }
}

export default AnnualPlanModel
