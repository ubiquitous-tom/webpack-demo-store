import _ from 'underscore'
import PlansChange from 'common/models/plans-change'
import ATVModel from 'common/model'

class SwitchToAnnualPlanModel extends ATVModel {
  get defaults() {
    return {
      isPromoApplied: false,
    }
  }

  initialize() {
    console.log('SwitchToAnnualPlanModel initialize')
    console.log(this)

    this.getMonthlyToAnnualUpgradeInfo()
  }

  getMonthlyToAnnualUpgradeInfo() {
    console.log('SwitchToAnnualPlanModel getMonthlyToAnnualUpgrade')
    const type = 'upgrade'
    const fromFrequency = 'monthly'
    const toFrequency = 'annual'
    const plansAvailable = this.get('plansAvailable')
    _.each(plansAvailable, (plan, key, collection) => {
      // console.log(plan.type)
      if (plan.type === type) {
        // console.log(plan.from_frequency, plan.to_frequency)
        if (plan.from_frequency === fromFrequency && plan.to_frequency === toFrequency) {
          console.log(plan)
          this.set('currentUpgradePlan', plan)
          console.log(this)

          return plan
        }
      }
      return collection
    })
  }

  confirmUpgrade() {
    console.log('SwitchToAnnualPlanModel confirmUpgrade')
    this.loadingStart()
    const plansChange = new PlansChange()
    const headers = {
      StripeMembershipID: this.get('currentMembership').StripeMembershipID,
      CustomerID: this.get('currentMembership').CustomerID,
      StripeCardToken: (this.has('currentBillingInfo') && this.get('currentBillingInfo').StripeCardToken)
        ? this.get('currentBillingInfo').StripeCardToken
        : '',
    }

    const attributes = {
      from: this.get('currentUpgradePlan').from_stripe_plan_id,
      to: this.get('currentUpgradePlan').to_stripe_plan_id,
      promo_code: this.has('promoCode') ? this.get('promoCode') : '',
    }
    const options = {
      url: [plansChange.url, $.param(attributes)].join('?'),
      context: this,
      dataType: 'json',
      ajaxSync: true,
      wait: true,
      headers,
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
    const currentPeriodEnd = new Date(resp.current_period_end * 1000).toLocaleDateString('en-US')
    const pricing = (Math.floor((this.get('annualStripePlan').SubscriptionAmount / 12) * 100) / 100).toFixed(2)
    const perMonthPricing = this.get('annualStripePlan').CurrSymbol + pricing
    // const message = `
    // You've upgraded to the Annual Plan. You will be billed ${annualPricing}
    //  on ${currentPeriodEnd}.
    //  That's only ${perMonthPricing}/mo!
    // `
    this.set({
      upgradeToAnnualSuccess: true,
      flashMessage: {
        type: 'success',
        message: 'UPGRADED-TO-ANNUAL-BILLED-DATE-PRICE',
        interpolationOptions: {
          annualPricing,
          currentPeriodEnd,
          perMonthPricing,
        },
      },
    })
  }

  error(model, resp, options) {
    console.log('SwitchToAnnualPlanModel error')
    console.log(model, resp, options)
    debugger
    let message = ''
    /* eslint function-paren-newline: 0 */
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
        model.set({
          upgradeToAnnualSuccess: false,
          flashMessage: {
            type: 'error',
            message,
            interpolationOptions: {},
          },
        })
        console.log(model.get('flashMessage').message, model.get('flashMessage').type)
      })
  }

  loadingStart() {
    console.log('ApplyPromoCodeModel loadingStart')
  }

  loadingStop() {
    console.log('ApplyPromoCodeModel loadingStop')
  }
}

export default SwitchToAnnualPlanModel
