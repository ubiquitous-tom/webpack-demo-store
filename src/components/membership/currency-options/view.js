import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import template from './index.hbs'

class MembershipCurrencyOptions extends View {
  get el() {
    return '.membership.store.container'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'change #currency-select': 'changeCurrency',
    }
  }

  initialize() {
    console.log('MembershipCurrencyOptions initialize')
    this.gifting = this.model.get('gifting')

    const stripePlans = this.model.get('stripePlans')
    const currencies = stripePlans
      .map((obj) => {
        let currency = null
        if (obj.Term === 30 && obj.TermType === 'DAY') {
          currency = obj
        }
        return currency
      })
      .filter((item) => (item !== null))
    console.log(currencies)
    this.currencies = currencies
    if (_.size(currencies) > 1) {
      this.render()
    }
  }

  render() {
    console.log('MembershipCurrencyOptions render')
    console.log(this.model.attributes)
    const attributes = {
      optionEls: this.currentOptions(),
    }
    const html = this.template(attributes)
    this.$el.append(html)

    const currencyDesc = this.gifting.get('gift').CurrencyDesc
    this.$el
      .find(`#currency-select option[value="${currencyDesc}"]`)
      .prop('select', true)

    return this
  }

  changeCurrency(e) {
    console.log(e)
    const { value } = e.target
    this.updateCurrency(value)
  }

  currentOptions() {
    let options = ''
    _.each(this.currencies, (currency) => {
      options += `<option value="${currency.CurrencyDesc}-${currency.CurrSymbol}">${currency.CurrencyDesc}</option>`
    })

    return options
  }

  updateCurrency(currency) {
    console.log(currency)
  }
}

export default MembershipCurrencyOptions
