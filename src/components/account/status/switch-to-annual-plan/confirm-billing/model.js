import { Model } from 'backbone'
import _ from 'underscore'

class ConfirmBillingModel extends Model {

  get url() {
    return '/stripedefaultcard?country=US'
  }

  initialize(options) {
    console.log('ConfirmBillingModel initialize')
    // // console.log(this)
    // // console.log(options)
    // console.log(options.parentModel)
    // // this.model = options.parentModel
    // this.model = options.parentModel
    // console.log(this.model)
    // const stripeCustomerID = this.model.get('Customer').StripeCustomerID

    // const stripeCustomerID = options.stripeCustomerID
    console.log(options)
    this.switchToAnnualPlanModel = options.switchToAnnualPlanModel
    console.log(this.switchToAnnualPlanModel)
    this.getCurrentBillingInfo()

    const stripeCustomerID = this.switchToAnnualPlanModel.get('Customer').StripeCustomerID
    console.log(stripeCustomerID)
    this.fetch({
      ajaxSync: true,
      headers: {
        StripeCustomerId: stripeCustomerID,
      }
    })
  }

  parse(resp) {
    console.log('ConfirmBillingModel parse')
    // console.log(resp)
    if (!_.isEmpty(resp)) {
      this.set('stripeCardInfo', resp)
      this.getCardExpiry()
    }
    // console.log(this.get('stripeCardInfo'))

    return resp
  }

  getCardExpiry() {
    console.log('ConfirmBillingModel getCardExpiry')
    const stripeCardInfo = this.has('newStripeCardInfo')
      ? this.get('newStripeCardInfo')
      : this.get('stripeCardInfo')
    console.log(stripeCardInfo.last4, stripeCardInfo.exp_month, stripeCardInfo.exp_year)
    const cardExpiry = [this.zeroPad(stripeCardInfo.exp_month, 2), stripeCardInfo.exp_year].join('/')
    console.log(cardExpiry)
    this.set({ 'fullCardExpiry': cardExpiry })
  }

  zeroPad(num, places) {
    return String(num).padStart(places, '0')
  }

  getCurrentBillingInfo() {
    console.log('ConfirmBillingModel getCurrentBillingInfo')
    const currentBillingInfo = {
      name: this.switchToAnnualPlanModel.get('Customer').Name,
      // email: this.switchToAnnualPlanModel.get('Customer').Email,
      // last4: ...
      zipcode: this.switchToAnnualPlanModel.get('BillingAddress').PostalCode,
      country: this.switchToAnnualPlanModel.get('BillingAddress').Country,
      StripeCustomerID: this.switchToAnnualPlanModel.get('Customer').StripeCustomerID
    }
    console.log(currentBillingInfo)
    this.switchToAnnualPlanModel.set('currentBillingInfo', currentBillingInfo)
  }

  updateCurrentBillingInfo() {
    console.log('ConfirmBillingModel updateCurrentBillingInfo')
    const currentBillingInfo = {
      name: this.get('newStripeCardInfo').name,
      // email: this.switchToAnnualPlanModel.get('Customer').Email,
      last4: this.get('newStripeCardInfo').last4,
      zipcode: this.get('newStripeCardInfo').zipcode,
      country: this.get('newStripeCardInfo').country,
      stripeCustomerID: this.get('newStripeCardInfo').token
    }
    this.switchToAnnualPlanModel.set('currentBillingInfo', currentBillingInfo)
  }
}

export default ConfirmBillingModel
