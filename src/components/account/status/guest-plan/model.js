// import { LocalStorage } from 'backbone'
// import _ from 'underscore'
import ATVModel from 'common/model'
import StripePlans from 'common/models/stripe-plans'

class GuestPlanModel extends ATVModel {
  initialize() {
    console.log('GuestPlanModel initialize')
    const stripePlans = new StripePlans()
    this.set('monthlyStripePlan', stripePlans.get('monthlyStripePlan'))
    console.log(this.get('monthlyStripePlan'))
  }
}

export default GuestPlanModel
