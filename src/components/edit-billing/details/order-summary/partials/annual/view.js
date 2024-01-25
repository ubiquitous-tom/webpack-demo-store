import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class EditBillingDetailsOrderSummaryAnnual extends View {
  get el() {
    return '#edit-billing-details'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'submit .form-trial-signup': 'submit',
    }
  }

  initialize() {
    console.log('EditBillingDetailsOrderSummaryAnnual initialize')
    this.cart = this.model.get('cart')
    this.gifting = this.model.get('gifting')
    if (this.cart.getItemQuantity('annual')) {
      this.render()
    }
  }

  render() {
    console.log('EditBillingDetailsOrderSummaryAnnual render')
    console.log(this.model.attributes)
    const quantity = this.cart.getItemQuantity('annual')
    const price = this.applyPromoPrice(
      [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        this.cart.getItemAmount('annual'),
      ].join(''),
    )
    const membershipPromo = false // this.model.has('membershipPromo')
    const promoName = membershipPromo ? this.model.get('membershipPromo').Name : ''
    const attributes = {
      quantity,
      price,
      membershipPromo,
      promoName,
    }
    const html = this.template(attributes)
    this.$el.find('.order-summary table tbody').append(html)

    return this
  }

  applyPromoPrice(originalPrice) {
    if (this.model.has('membershipPromo')) {
      const oldPrice = [
        this.gifting.get('gift').CurrSymbol,
        this.model.get('annualStripePlan').SubscriptionAmount,
      ].join('')
      const newPrice = [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        Intl.NumberFormat(`${this.model.get('stripePlansLang')}-IN`, { maximumFractionDigits: 2, minimumFractionDigits: 2, trailingZeroDisplay: 'stripIfInteger' }).format(this.cart.getItemAmount('annual')),
      ].join('')
      return `<span>${newPrice}<del> <span class="old-pricing">${oldPrice}</span></del></span>`
    }

    return originalPrice
  }
}

export default EditBillingDetailsOrderSummaryAnnual
