import ATVModel from 'core/model'
import StripePlans from 'core/models/stripe-plans'

class MembershipModel extends ATVModel {
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
    console.log('MembershipModel initialize')

    this.stripePlans = new StripePlans()
    this.stripePlans.on('change:stripePlans', (model, value) => {
      console.log(model, value)
      // debugger
      this.set({
        stripePlans: value,
        stripePlansCountry: model.get('stripePlansCountry'),
        stripePlansLang: model.get('stripePlansLang'),
      })
    })

    this.stripePlans.on('change:annualStripePlan', (model, value) => {
      console.log(model, value)
      // debugger
      this.updateGiftPrice(value)
      this.set('annualStripePlan', value)
    })

    this.stripePlans.on('change:monthlyStripePlan', (model, value) => {
      console.log(model, value)
      // debugger
      this.updateGiftCurrency(value)
      this.set('monthlyStripePlan', value)
    })
  }

  updateGiftPrice(annualStripePlan) {
    console.log('MembershipModel updateGiftPrice')
    const gift = this.get('gift')
    console.log(gift)

    this.set({
      gift: {
        quantity: gift.quantity,
        CurrSymbol: gift.CurrSymbol,
        CurrHtmlSymbol: gift.CurrHtmlSymbol,
        CurrencyDesc: gift.CurrencyDesc,
        CurrencyName: gift.CurrencyName,
        amount: annualStripePlan.SubscriptionAmount,
      },
    })
  }

  updateGiftCurrency(monthlyStripePlan) {
    console.log('MembershipModel updateGiftPrice')
    const gift = this.get('gift')
    console.log(gift)

    this.set({
      gift: {
        quantity: gift.quantity,
        CurrSymbol: monthlyStripePlan.CurrSymbol,
        CurrHtmlSymbol: monthlyStripePlan.CurrHtmlSymbol,
        CurrencyDesc: monthlyStripePlan.CurrencyDesc,
        CurrencyName: monthlyStripePlan.CurrencyName,
        amount: gift.amount,
      },
    })
  }
}

export default MembershipModel
