import _ from 'underscore'
import ATVModel from 'common/model'
import PlansChange from 'common/models/plans-change'

class SwitchToMonthlyPlanModel extends ATVModel {
  initialize() {
    console.log('SwitchToMonthlyPlanModel initialize')
    console.log(this)

    this.getAnnualToMonthlyDowngradeInfo()
  }

  getAnnualToMonthlyDowngradeInfo() {
    console.log('SwitchToMonthlyPlanModel getAnnualToMonthlyDowngradeInfo')
    const type = 'downgrade'
    const fromFrequency = 'annual'
    const toFrequency = 'monthly'
    const plansAvailable = this.get('plansAvailable')
    // console.log(plansAvailable)
    _.each(plansAvailable, (plan, key, collection) => {
      // console.log(plan.type)
      if (plan.type === type) {
        // console.log(plan.from_frequency, plan.to_frequency)
        if (plan.from_frequency === fromFrequency && plan.to_frequency === toFrequency) {
          console.log(plan)
          this.set('currentDowngradePlan', plan)
          console.log(this)

          return plan
        }
      }
      return collection
    })
  }

  switchToMonthly() {
    console.log('SwitchToMonthlyPlanModel switchToMonthly')
    const plansChange = new PlansChange()
    const headers = {
      StripeMembershipID: this.get('currentMembership').StripeMembershipID,
      CustomerID: this.get('currentMembership').CustomerID,
      StripeCardToken: this.has('currentBillingInfo').StripeCardToken
        ? this.get('currentBillingInfo').StripeCardToken
        : '',
    }

    const attributes = {
      from: this.get('currentDowngradePlan').from_stripe_plan_id,
      to: this.get('currentDowngradePlan').to_stripe_plan_id,
      // promo_code: this.has('promoCode') ? this.get('promoCode').promocode : '',
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
    console.log('SwitchToMonthlyPlanModel success')
    console.log(this)
    debugger
    console.log(model, resp, options)
    const currentPeriodEnd = new Date(resp.current_period_end * 1000).toLocaleDateString('en-US')
    // TODO: translation `SWITCHED-TO-MONTHLY-DATE`
    const message = `You've switched to Monthly Plan. Monthly billing will start after your Annual Plan ends on ${currentPeriodEnd}.`
    this.set({
      downgradeToMonthlySuccess: true,
      flashMessage: {
        type: 'success',
        message,
      },
    })
  }

  error(model, resp, options) {
    console.log('SwitchToMonthlyPlanModel error')
    console.log(model, resp, options)
    console.log(this)
    debugger
    let message = ''
    /* eslint function-paren-newline: 0 */
    resp
      .then(
        (response) => {
          debugger
          console.log(response.responseJSON, response.responseText)
          if (!_.isEmpty(response.responseJSON)) {
            // this.set({flashMessage: {'message': response.responseJSON.message}})
            message = response.responseJSON.message
          }
          if (!_.isEmpty(response.responseText)) {
            // this.set({flashMessage: {'message': response.responseText}})
            message = response.responseText
          }
        },
        (error) => {
          debugger
          console.log(error.responseJSON, error.responseText)
          if (!_.isEmpty(error.responseJSON)) {
            // this.set({flashMessage: {'message': error.responseJSON.error}})
            message = error.responseJSON.error
          }
          if (!_.isEmpty(error.responseText)) {
            // this.set({flashMessage: {'message': error.responseText}})
            message = error.responseText
          }
        })
      .always(() => {
        debugger
        this.set({
          downgradeToMonthlySuccess: false,
          flashMessage: {
            type: 'error',
            message,
          },
        })
        console.log(this.get('flashMessage').message, this.get('flashMessage').type)
      })
  }
}

export default SwitchToMonthlyPlanModel
