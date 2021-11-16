import { Model } from 'backbone'
import _ from 'underscore'
import Dispatcher from 'common/dispatcher'
import FlashMessage from 'shared/elements/flash-message/view'
import PlansChange from 'common/models/plans-change'

class SwitchToAnnualPlanModel extends Model {


  initialize() {
    console.log('SwitchToAnnualPlanModel initialize')
    console.log(this)

    // this.set('service', 'acorn')
    this.dispatcher = new Dispatcher()
    this.flashMessage = new FlashMessage({ dispatcher: this.dispatcher })

    // const params = {
    //   CustomerID: this.get('Customer').CustomerID,
    // }
    // console.log(this, params, $.param(params))
    // this.fetch({
    //   dataType: 'json',
    //   ajaxSync: true,
    //   wait: true,
    //   data: $.param(params)
    // })
    this.getMonthlyToAnnualUpgradeInfo()
  }

  // parse(resp) {
  //   console.log('SwitchToAnnualPlanModel parse')
  //   console.log(resp)
  //   if (!_.isEmpty(resp)) {
  //     this.set('currentMembership', resp)
  //   }
  //   console.log(this.get('currentMembership'))

  //   return resp
  // }

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
          console.log(plan)
          this.set('currentUpgradePlan', plan)
          console.log(this)

          return plan
        }
      }
    })
  }

  // getCardExpiry() {
  //   console.log('SwitchToAnnualPlan getCardExpiry')
  //   const stripeCardInfo = this.get('stripeCardInfo')
  //   console.log(stripeCardInfo.last4, stripeCardInfo.exp_month, stripeCardInfo.exp_year)
  //   const cardExpiry = [this.zeroPad(stripeCardInfo.exp_month, 2), stripeCardInfo.exp_year].join('/')
  //   this.set('fullCardExpiry', cardExpiry)
  // }

  confirmUpgrade() {
    console.log('SwitchToAnnualPlanModel confirmUpgrade')
    this.loadingStart()
    const plansChange = new PlansChange()
    const attributes = {
      from: this.get('currentUpgradePlan').from_stripe_plan_id,
      to: this.get('currentUpgradePlan').to_stripe_plan_id,
      promocode: this.has('promoCode') ? this.get('promoCode').promocode : '',
    }
    const options = {
      dataType: 'json',
      ajaxSync: true,
      method: 'POST',
      wait: true,
      headers: {
        StripeMembershipID: this.get('currentMembership').StripeMembershipID,
        CustomerID: this.get('currentMembership').CustomerID,
        StripeCardToken: this.get('currentBillingInfo').StripeCustomerID,
      },
      success: this.success,
      error: this.error,
    }
    console.log(attributes, options)
    plansChange.save(attributes, options)
    // console.log(this)
    // this.success()
  }

  // zeroPad(num, places) {
  //   return String(num).padStart(places, '0')
  // }

  success(model, resp, options) {
    console.log('SwitchToAnnualPlanModel success')
    console.log(model, resp, options)
    const annualPricing = this.get('annualStripePlan').CurrSymbol + this.get('annualStripePlan').SubscriptionAmount
    let perMonthPricing = (Math.floor((this.get('annualStripePlan').SubscriptionAmount / 12) * 100) / 100).toFixed(2)
    perMonthPricing = this.get('annualStripePlan').CurrSymbol + perMonthPricing
    let message = `You've upgraded to the Annual Plan. You will be billed ${annualPricing} on XX/XX/XXXX. That's only ${perMonthPricing}/mo!`
    this.set({
      type: 'success',
      message: message,
    })
    // this.showFlashMessage(model, resp, options)
    this.dispatcher.trigger('showFlashMessage', this.get('message'), this.get('type'))
  }

  error(model, resp, options) {
    console.log('SwitchToAnnualPlanModel error')
    console.log(model, resp, options)
    resp
      .then(
        (response) => {
          console.log(response.responseJSON)
          if (!_.isEmpty(response.responseJSON)) {
            this.set('message', response.responseJSON.message)
          }
        },
        (error) => {
          console.log(error.responseJSON)
          if (!_.isEmpty(error.responseJSON)) {
            this.set('message', error.responseJSON.error)
          }
        })
      .always(() => {
        console.log(this.get('message'), this.get('type'))
        // console.log(this.dispatcher)
        this.dispatcher.trigger('showFlashMessage', this.get('message'), this.get('type'))
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
