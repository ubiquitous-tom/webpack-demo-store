import { View } from 'backbone'

import PromoValidateModel from 'core/models/promo-validate'

// import './stylesheet.scss'
import template from './index.hbs'

class EditBillingDetailsOrderSummaryMonthly extends View {
  get el() {
    return '#edit-billing-details'
  }

  get template() {
    return template
  }

  initialize(options) {
    console.log('EditBillingDetailsOrderSummaryMonthly initialize')
    this.parentView = options.parentView
    this.cart = this.model.get('cart')
    this.gifting = this.model.get('gifting')

    this.promoValidateModel = new PromoValidateModel(this.model.attributes)

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
    // const promoName = membershipPromo ? this.model.get('membershipPromo').Name : ''
    const promoName = membershipPromo
      ? this.parentView.promoMessageFormatter(this.promoValidateModel.promoMessageParser())
      : ''
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
      const ogPrice = this.model.get('monthlyStripePlan').SubscriptionAmount
      const nowPrice = this.cart.getItemAmount('monthly')
      if (ogPrice !== nowPrice) {
        const oldPrice = [
          this.gifting.get('gift').CurrSymbol,
          ogPrice,
        ].join('')
        const newPrice = [
          this.gifting.get('gift').CurrencyDesc,
          this.gifting.get('gift').CurrSymbol,
          Intl.NumberFormat(
            `${this.model.get('stripePlansLang')}-IN`,
            {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
              trailingZeroDisplay: 'stripIfInteger',
            },
          ).format(nowPrice),
        ].join('')
        return `<span>${newPrice}<del> <span class="old-pricing">${oldPrice}</span></del></span>`
      }
    }

    return originalPrice
  }
}

export default EditBillingDetailsOrderSummaryMonthly
