import _ from 'underscore'
import ATVModel from 'common/model'
import Dispatcher from 'common/dispatcher'
import FlashMessage from 'shared/elements/flash-message/view'
import PlansChange from 'common/models/plans-change'

class SwitchToMonthlyPlanModel extends ATVModel {

  initialize() {
    console.log('SwitchToMonthlyPlanModel initialize')
    console.log(this)

    this.dispatcher = new Dispatcher()
    this.flashMessage = new FlashMessage({ dispatcher: this.dispatcher })

    this.getAnnualToMonthlyDowngradeInfo()
  }

  getAnnualToMonthlyDowngradeInfo() {
    console.log('SwitchToMonthlyPlanModel getAnnualToMonthlyDowngradeInfo')
    const type = 'downgrade'
    const from_frequency = 'annual'
    const to_frequency = 'monthly'
    const plansAvailable = this.get('plansAvailable')
    // console.log(plansAvailable)
    _.each(plansAvailable, (plan, key, collection) => {
      // console.log(plan.type)
      if (plan.type === type) {
        // console.log(plan.from_frequency, plan.to_frequency)
        if (plan.from_frequency === from_frequency && plan.to_frequency === to_frequency) {
          console.log(plan)
          this.set('currentDowngradePlan', plan)
          console.log(this)

          return plan
        }
      }
    })
  }

  switchToMonthly() {
    console.log('SwitchToMonthlyPlanModel switchToMonthly')
    const plansChange = new PlansChange()
    let headers = {
      StripeMembershipID: this.get('currentMembership').StripeMembershipID,
      CustomerID: this.get('currentMembership').CustomerID,
      StripeCardToken: this.has('currentBillingInfo').StripeCardToken
        ? this.get('currentBillingInfo').StripeCardToken
        : '',
    }
    // if (this.has('currentBillingInfo').StripeCardToken) {
    //   header.StripeCardToken = this.get('currentBillingInfo').StripeCardToken
    // }

    const attributes = {
      from: this.get('currentDowngradePlan').from_stripe_plan_id,
      to: this.get('currentDowngradePlan').to_stripe_plan_id,
      // promocode: this.has('promoCode') ? this.get('promoCode').promocode : '',
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
    console.log('SwitchToMonthlyPlanModel success')
    console.log(this)
    debugger
    console.log(model, resp, options)
    const currentPeriodEnd = new Date(resp.current_period_end * 1000).toLocaleDateString("en-US")
    const message = `You've switched to Monthly Plan. Monthly billing will start after your Annual Plan ends on ${currentPeriodEnd}.`
    this.set({
      downgradeToMonthlySuccess: true,
      flashMessage: {
        type: 'success',
        message: message,
      }
    })
    // this.showFlashMessage(model, resp, options)
    this.dispatcher.trigger('showFlashMessage', this.get('flashMessage').message, this.get('flashMessage').type)

  }

  error(model, resp, options) {
    console.log('SwitchToMonthlyPlanModel error')
    console.log(this)
    debugger
    console.log(model, resp, options)
    this.set({
      downgradeToMonthlySuccess: false,
      flashMessage: {
        type: 'error',
      }
    })
    resp
      .then(
        (response) => {
          debugger
          console.log(response.responseJSON, responseText)
          if (!_.isEmpty(response.responseJSON)) {
            this.set({
              flashMessage: {
                'message': response.responseJSON.message,
              }
            })
          }
          if (!_.isEmpty(response.responseText)) {
            this.set({
              flashMessage: {
                'message': response.responseText,
              }
            })
          }
        },
        (error) => {
          debugger
          console.log(error.responseJSON, responseText)
          if (!_.isEmpty(response.responseJSON)) {
            this.set({
              flashMessage: {
                'message': response.responseJSON.message,
              }
            })
          }
          if (!_.isEmpty(response.responseText)) {
            this.set({
              flashMessage: {
                'message': response.responseText,
              }
            })
          }
        })
      .always(() => {
        debugger
        console.log(this.get('flashMessage').message, this.get('flashMessage').type)
        // console.log(this.dispatcher)
        this.dispatcher.trigger('showFlashMessage', this.get('flashMessage').message, this.get('flashMessage').type)
      })
  }
}

export default SwitchToMonthlyPlanModel
