import _ from 'underscore'
// import Dispatcher from 'common/dispatcher'
// import FlashMessage from 'shared/elements/flash-message'
import PlansChange from 'common/models/plans-change'
import ATVModel from 'common/model'

class SwitchToAnnualPlanModel extends ATVModel {

  get defaults() {
    return {
      isPromoApplied: false
    }
  }

  initialize() {
    console.log('SwitchToAnnualPlanModel initialize')
    console.log(this)

    // this.dispatcher = new Dispatcher()
    // this.flashMessage = new FlashMessage({ dispatcher: this.dispatcher })

    this.getMonthlyToAnnualUpgradeInfo()
  }

  getMonthlyToAnnualUpgradeInfo() {
    console.log('SwitchToAnnualPlanModel getMonthlyToAnnualUpgrade')
    const type = 'upgrade'
    const from_frequency = 'monthly'
    const to_frequency = 'annual'
    const plansAvailable = this.get('plansAvailable')
    _.each(plansAvailable, (plan, key, collection) => {
      // console.log(plan.type)
      if (plan.type === type) {
        // console.log(plan.from_frequency, plan.to_frequency)
        if (plan.from_frequency === from_frequency && plan.to_frequency === to_frequency) {
          console.log(plan)
          this.set('currentUpgradePlan', plan)
          console.log(this)

          return plan
        }
      }
    })
  }

  confirmUpgrade() {
    console.log('SwitchToAnnualPlanModel confirmUpgrade')
    this.loadingStart()
    const plansChange = new PlansChange()
    let headers = {
      StripeMembershipID: this.get('currentMembership').StripeMembershipID,
      CustomerID: this.get('currentMembership').CustomerID,
      StripeCardToken: (this.has('currentBillingInfo') && this.get('currentBillingInfo').StripeCardToken)
        ? this.get('currentBillingInfo').StripeCardToken
        : '',
    }

    const attributes = {
      from: this.get('currentUpgradePlan').from_stripe_plan_id,
      to: this.get('currentUpgradePlan').to_stripe_plan_id,
      promocode: this.has('promoCode') ? this.get('promoCode') : '',
    }
    const options = {
      context: this,
      dataType: 'json',
      ajaxSync: true,
      wait: true,
      headers: headers,
      success: this.success,
      error: this.error,
    }
    console.log(attributes, options)
    plansChange.save(attributes, options)
  }

  success(model, resp, options) {
    console.log('SwitchToAnnualPlanModel success')
    console.log(model, resp, options)
    debugger
    const annualPricing = this.get('annualStripePlan').CurrSymbol + this.get('annualStripePlan').SubscriptionAmount
    const currentPeriodEnd = new Date(resp.current_period_end * 1000).toLocaleDateString("en-US")
    const pricing = (Math.floor((this.get('annualStripePlan').SubscriptionAmount / 12) * 100) / 100).toFixed(2)
    const perMonthPricing = this.get('annualStripePlan').CurrSymbol + pricing
    let message = `You've upgraded to the Annual Plan. You will be billed ${annualPricing} on ${currentPeriodEnd}. That's only ${perMonthPricing}/mo!`
    this.set({
      upgradeToAnnualSuccess: true,
      flashMessage: {
        type: 'success',
        message: message,
      }
    })
  }

  error(model, resp, options) {
    console.log('SwitchToAnnualPlanModel error')
    console.log(model, resp, options)
    debugger
    let message = ''
    resp
      .then(
        (response) => {
          console.log(response.responseJSON, response.responseText)
          if (!_.isEmpty(response.responseJSON)) {
            message = response.responseJSON.message
          }
        },
        (error) => {
          console.log(error.responseJSON, error.responseText)
          if (!_.isEmpty(error.responseJSON)) {
            message = error.responseJSON.error
          }
        })
      .always(() => {
        this.set({
          upgradeToAnnualSuccess: false,
          flashMessage: {
            type: 'error',
            message: message
          }
        })
        console.log(this.get('flashMessage').message, this.get('flashMessage').type)
        // this.dispatcher.trigger('upgradeToAnnual:error', this)
      })
  }

  loadingStart() {
    console.log('ApplyPromoCodeModel loadingStart')
  }

  loadingStop(model, xhr, options) {
    console.log('ApplyPromoCodeModel loadingStop')
  }
}

export default SwitchToAnnualPlanModel
