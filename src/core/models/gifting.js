import { Model } from 'backbone'
import _ from 'underscore'
// import ATVModel from 'core/model'
// import StripePlans from 'core/models/stripe-plans'

class Gifting extends Model {
  get defaults() {
    return {
      gift: {
        quantity: 0,
        CurrSymbol: '$',
        CurrHtmlSymbol: '&#36;',
        CurrencyDesc: 'USD',
        CurrencyName: 'Dollars',
        amount: '69.99',
      },
    }
  }

  initialize() {
    console.log('Gifting initialize')

    //   this.stripePlans = new StripePlans()
    //   this.stripePlans.on('change:stripePlans', (model, value) => {
    //     console.log(model, value)
    //     // debugger
    //     this.set({
    //       stripePlans: value,
    //       stripePlansCountry: model.get('stripePlansCountry'),
    //       stripePlansLang: model.get('stripePlansLang'),
    //     })
    //   })

    //   this.stripePlans.on('change:annualStripePlan', (model, value) => {
    //     console.log(model, value)
    //     // debugger
    //     this.updateGiftPrice(value)
    //     this.set('annualStripePlan', value)
    //   })

    //   this.stripePlans.on('change:monthlyStripePlan', (model, value) => {
    //     console.log(model, value)
    //     // debugger
    //     this.updateGiftCurrency(value)
    //     this.set('monthlyStripePlan', value)
    //   })
  }

  updateGiftPrice(annualStripePlan) {
    console.log('Gifting updateGiftPrice')
    const gift = this.get('gift')
    console.log(gift)
    // debugger
    this.set({
      gift: {
        quantity: gift.quantity,
        CurrSymbol: gift.CurrSymbol,
        CurrHtmlSymbol: gift.CurrHtmlSymbol,
        CurrencyDesc: gift.CurrencyDesc,
        CurrencyName: gift.CurrencyName,
        amount: annualStripePlan.SubscriptionAmount,
      },
      // annualStripePlan,
    })
  }

  updateGiftCurrency(monthlyStripePlan) {
    console.log('Gifting updateGiftPrice')
    const gift = this.get('gift')
    console.log(gift)
    // debugger
    this.set({
      gift: {
        quantity: gift.quantity,
        CurrSymbol: monthlyStripePlan.CurrSymbol,
        CurrHtmlSymbol: monthlyStripePlan.CurrHtmlSymbol,
        CurrencyDesc: monthlyStripePlan.CurrencyDesc,
        CurrencyName: monthlyStripePlan.CurrencyName,
        amount: gift.amount,
      },
      // monthlyStripePlan,
    })
  }

  discountRateGiftPricing(discountRateGift) {
    console.log('Gifting discountRateGiftPrice')
    const gift = this.get('gift')
    console.log(gift)
    // debugger
    _.each(discountRateGift, (item) => {
      const defaultCurrencySymbl = gift.CurrencyDesc
      const defaultCurrency = gift.CurrSymbol
      const giftItem = item
      giftItem.displayPrice = defaultCurrencySymbl + defaultCurrency + item.Amount
      return giftItem
    }, this)
    console.log(discountRateGift)
  }
}

export default Gifting
