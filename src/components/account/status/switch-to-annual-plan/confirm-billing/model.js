import { Model } from 'backbone'
import _ from 'underscore'

class ConfirmBillingModel extends Model {
  get url() {
    const country = this.get('stripePlansCountry') || 'US'
    return `/stripedefaultcard?country=${country}`
  }

  initialize() {
    console.log('ConfirmBillingModel initialize')
    console.log(this)
    // console.log(this.model)
    this.getCurrentBillingInfo()

    const stripeCustomerID = this.get('Customer').StripeCustomerID
    console.log(stripeCustomerID)
    this.fetch({
      ajaxSync: true,
      headers: {
        StripeCustomerId: stripeCustomerID,
      },
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
    this.set({ fullCardExpiry: cardExpiry })
  }

  zeroPad(num, places) {
    return String(num).padStart(places, '0')
  }

  getCurrentBillingInfo() {
    console.log('ConfirmBillingModel getCurrentBillingInfo')
    const currentBillingInfo = {
      name: this.get('Customer').Name,
      // email: this.get('Customer').Email,
      // last4: ...
      zipcode: this.get('BillingAddress').PostalCode,
      country: this.get('BillingAddress').StripeCountryCode || this.get('BillingAddress').Country,
      customerID: this.get('currentMembership').CustomerID,
      StripeCustomerID: this.get('Customer').StripeCustomerID,
    }
    console.log(currentBillingInfo)
    this.set('currentBillingInfo', currentBillingInfo)
  }

  updateCurrentBillingInfo() {
    console.log('ConfirmBillingModel updateCurrentBillingInfo')
    console.log(this, this.get('newStripeCardInfo'))
    const currentBillingInfo = {
      name: this.get('newStripeCardInfo').name,
      // email: this.switchToAnnualPlanModel.get('Customer').Email,
      last4: this.get('newStripeCardInfo').last4,
      zipcode: this.get('newStripeCardInfo').address_zip,
      country: this.get('newStripeCardInfo').address_country,
      customerID: this.get('currentMembership').CustomerID,
      StripeCardToken: this.get('newStripeCardInfo').token,
    }
    this.set('currentBillingInfo', currentBillingInfo)
    this.getCardExpiry()
  }
}

export default ConfirmBillingModel
