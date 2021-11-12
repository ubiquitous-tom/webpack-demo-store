import { Model } from 'backbone'
import _ from 'underscore'
import StripeToken from 'common/stripetoken'

class SwitchToAnnualPlanModel extends Model {

  get url() {
    return '/stripedefaultcard?country=US'
  }

  initialize(options) {
    console.log('SwitchToAnnualPlanModel initialize')
    // console.log(this, options)
    this.stripeToken = new StripeToken()
    this.getMonthlyToAnnualUpgradeInfo()
    this.getStripeCardObject()
  }

  parse(resp) {
    console.log('SwitchToAnnualPlanModel parse')
    console.log(resp)
    if (!_.isEmpty(resp)) {
      this.set('stripeCardInfo', resp)
      this.getCardExpiry()
    }
    // console.log(this.get('stripeCardInfo'))

    return resp
  }

  getMonthlyToAnnualUpgradeInfo() {
    console.log('SwitchToAnnualPlanModel getMonthlyToAnnualUpgrade')
    const type = 'upgrade'
    const from_frequency = 'monthly'
    const to_frequency = 'annual'
    const plansAvailable = this.get('plansAvailable')
    // console.log(plansAvailable)
    _.each(plansAvailable, (plan, key, collection) => {
      // console.log(plan.type)
      if (plan.type === type) {
        // console.log(plan.from_frequency, plan.to_frequency)
        if (plan.from_frequency === from_frequency && plan.to_frequency === to_frequency) {
          // console.log(plan)
          this.set('currentUpgradePlan', plan)
          return plan
        }
      }
    })
  }

  getStripeCardObject() {
    console.log('SwitchToAnnualPlanModel getStripeCardObject')
    const stripeCustomerID = this.get('Customer').StripeCustomerID
    this.fetch({
      ajaxSync: true,
      headers: {
        StripeCustomerId: stripeCustomerID,
      }
    })
  }

  getCardExpiry() {
    console.log('SwitchToAnnualPlan getCardExpiry')
    const stripeCardInfo = this.get('stripeCardInfo')
    console.log(stripeCardInfo.last4, stripeCardInfo.exp_month, stripeCardInfo.exp_year)
    const cardExpiry = [this.zeroPad(stripeCardInfo.exp_month, 2), stripeCardInfo.exp_year].join('/')
    this.set('fullCardExpiry', cardExpiry)
  }

  updateCard() {
    console.log('SwitchToAnnualPlanModel updateCard')
    const options = {
      dataType: 'json',
      ajaxSync: true,
      wait: true,
      success: this.success,
      error: this.error,
    }
    console.log(options)

    this.stripeToken.save(options)
  }

  confirmUpgrade() {
    console.log('SwitchToAnnualPlanModel updateCard')
  }

  zeroPad(num, places) {
    return String(num).padStart(places, '0')
  }

  success(resp) {
    console.log('SwitchToAnnualPlanModel success')
    console.log(resp)
  }

  error(err) {
    console.log('SwitchToAnnualPlanModel error')
    console.log(err)
  }
}

export default SwitchToAnnualPlanModel
