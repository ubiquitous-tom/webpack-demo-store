import { View } from 'backbone'

// import './stylesheet.scss'
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
    const amount = [
      this.gifting.get('gift').CurrencyDesc,
      this.gifting.get('gift').CurrSymbol,
      this.cart.getItemAmount('annual'),
    ].join('')
    const attributes = {
      quantity,
      amount,
    }
    const html = this.template(attributes)
    this.$el.find('.order-summary table tbody').append(html)

    return this
  }
}

export default EditBillingDetailsOrderSummaryAnnual
