import { View } from 'backbone'

// import './stylesheet.scss'
import template from './index.hbs'

class EditBillingDetailsOrderSummaryGift extends View {
  get el() {
    return '#content-section'
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
    console.log('EditBillingDetailsOrderSummaryGift initialize')
    this.cart = this.model.get('cart')
    this.gifting = this.model.get('gifting')
    // if (this.cart.getItemQuantity('gift')) {
    //   this.render()
    // }
  }

  render() {
    console.log('EditBillingDetailsOrderSummaryGift render')
    console.log(this.model.attributes)
    const quantity = this.cart.getItemQuantity('gift')
    const amount = [
      this.gifting.get('gift').CurrencyDesc,
      this.gifting.get('gift').CurrSymbol,
      this.cart.getItemAmount('gift'),
    ].join('')

    const giftItemSummary = this.timelinePromotion(quantity)
    const attributes = {
      quantity,
      amount,
      giftItemSummary,
    }
    const html = this.template(attributes)
    // this
    //   .$('.order-summary table tbody')
    //   .append(html)
    this.setElement('#edit-billing-details')
    this
      .$('.order-summary table tbody')
      .append(html)

    return this
  }

  timelinePromotion(quantity) {
    // Timeline Promotion (2020).
    console.log(quantity)
    const giftItemSummary = []
    if (this.model.get('storeType') === 'Gift') {
      if (this.model.has('DiscountRate') && quantity) {
        const discountRate = this.model.get('DiscountRate')
        discountRate.forEach((item) => {
          if (item.count <= quantity) {
            const giftItem = {}
            giftItem.quantity = item.count
            giftItem.amount = [
              this.gifting.get('gift').CurrencyDesc,
              this.gifting.get('gift').CurrSymbol,
              item.Amount,
            ].join('')
            giftItemSummary.push(giftItem)
          }
        })
      }
    }

    return giftItemSummary
  }
}

export default EditBillingDetailsOrderSummaryGift
