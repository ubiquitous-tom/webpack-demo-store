import { View } from 'backbone'

// import './stylesheet.scss'
import template from './index.hbs'

class EditBillingDetailsOrderSummaryMonthly extends View {
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
    console.log('EditBillingDetailsOrderSummaryMonthly initialize')
    this.cart = this.model.get('cart')
    this.gifting = this.model.get('gifting')
    if (this.cart.getItemQuantity('monthly')) {
      this.render()
    }
  }

  render() {
    console.log('EditBillingDetailsOrderSummaryMonthly render')
    console.log(this.model.attributes)
    const quantity = this.cart.getItemQuantity('monthly')
    const price = this.applyPromoPrice(
      [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        this.cart.getItemAmount('monthly'),
      ].join(''),
    )
    const membershipPromo = this.model.has('membershipPromo')
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
        this.model.get('monthlyStripePlan').SubscriptionAmount,
      ].join('')
      const newPrice = [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        this.cart.getItemAmount('monthly'),
      ].join('')
      return `<span>${newPrice}<del> <span class="old-pricing">${oldPrice}</span></del></span>`
    }

    return originalPrice
  }
}

export default EditBillingDetailsOrderSummaryMonthly
