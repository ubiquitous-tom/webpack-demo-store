import { View } from 'backbone'

// import './stylesheet.scss'
import template from './index.hbs'

class EditBillingDetailsOrderSummaryGift extends View {
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
    console.log('EditBillingDetailsOrderSummaryGift initialize')
    this.cart = this.model.get('cart')
    this.gifting = this.model.get('gifting')
    if (this.cart.getItemQuantity('gift')) {
      this.render()
    }
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
    const attributes = {
      quantity,
      amount,
    }
    const html = this.template(attributes)
    this.$el.find('.order-summary table tbody').append(html)

    return this
  }

  // renderTimelinePromotionHTML() {
  //   // Timeline Promotion (2020).
  //   let giftItemSummary = {}
  //   const seasonalPromotionCart = giveObj.has('SeasonalPromotionCart')
  //     ? giveObj.get('SeasonalPromotionCart')
  //     : {}
  //   if (!_.isEmpty(seasonalPromotionCart)) {
  //     giftItemSummary = seasonalPromotionCart
  //   }

  //   return giftItemSummary
  // }
}

export default EditBillingDetailsOrderSummaryGift
