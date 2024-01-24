import { View } from 'backbone'

// import './stylesheet.scss'
import template from './index.hbs'

class EditBillingDetailsOrderSummaryTotal extends View {
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
    console.log('EditBillingDetailsOrderSummaryTotal initialize')
    this.cart = this.model.get('cart')
    this.gifting = this.model.get('gifting')

    this.render()
  }

  render() {
    console.log('EditBillingDetailsOrderSummaryTotal render')
    console.log(this.model.attributes)
    const attributes = {
      orderTotal: this.orderTotal(),
    }
    const html = this.template(attributes)
    this.$el.find('.order-summary table tbody').append(html)

    return this
  }

  orderTotal() {
    const total = this.cart.getTotalAmount()
    return [
      this.gifting.get('gift').CurrencyDesc,
      this.gifting.get('gift').CurrSymbol,
      Intl.NumberFormat(`${this.model.get('stripePlansLang')}-IN`, { maximumFractionDigits: 2, minimumFractionDigits: 2, trailingZeroDisplay: 'stripIfInteger' }).format(total),
    ].join('')
  }
}

export default EditBillingDetailsOrderSummaryTotal
