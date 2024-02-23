import { View } from 'backbone'
import _ from 'underscore'

// import './stylesheet.scss'
import template from './index.hbs'

class EditBillingDetailsOrderSummaryTotal extends View {
  get el() {
    return '#edit-billing-details'
  }

  get template() {
    return template
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
      orderTotal: this.applyPromoPrice(this.orderTotal()),
    }
    const html = this.template(attributes)
    this.$el.find('.order-summary table tbody').append(html)

    return this
  }

  orderTotal() {
    const isGiftStore = (this.model.get('storeType') === 'Gift')
    const isDiscountRate = this.model.has('DiscountRate')
    const total = (isGiftStore && isDiscountRate)
      ? this.cart.getTotalTimelinePromomotionAmount(this.model.get('DiscountRate'))
      : this.cart.getTotalAmount()
    // debugger
    return [
      this.gifting.get('gift').CurrencyDesc,
      this.gifting.get('gift').CurrSymbol,
      Intl.NumberFormat(`${this.model.get('stripePlansLang')}-IN`, { maximumFractionDigits: 2, minimumFractionDigits: 2, trailingZeroDisplay: 'stripIfInteger' }).format(total),
    ].join('')
  }

  applyPromoPrice(originalPrice) {
    if (this.model.has('membershipPromo')) {
      const oldTotal = this.getTotalAmount()
      const oldPrice = [
        this.gifting.get('gift').CurrSymbol,
        Intl.NumberFormat(`${this.model.get('stripePlansLang')}-IN`, { maximumFractionDigits: 2, minimumFractionDigits: 2, trailingZeroDisplay: 'stripIfInteger' }).format(oldTotal),
      ].join('')

      const newTotal = this.cart.getTotalAmount()
      const newPrice = [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        Intl.NumberFormat(`${this.model.get('stripePlansLang')}-IN`, { maximumFractionDigits: 2, minimumFractionDigits: 2, trailingZeroDisplay: 'stripIfInteger' }).format(newTotal),
      ].join('')

      return (oldTotal !== newTotal)
        ? `<span>${newPrice}<del> <span class="old-pricing">${oldPrice}</span></del></span>`
        : originalPrice
    }

    return originalPrice
  }

  getTotalAmount() {
    const { attributes } = this.cart
    let total = 0
    _.each(attributes, (value, key, list) => {
      console.log(value, key, list)
      let fullAmount = value.amount
      if (key !== 'gift') {
        fullAmount = this.model.get(`${key}StripePlan`).SubscriptionAmount
      }
      total += value.quantity * fullAmount
    })
    return parseFloat(total.toFixed(2))
  }
}

export default EditBillingDetailsOrderSummaryTotal
