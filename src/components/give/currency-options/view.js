import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import template from './index.hbs'

class GiveCurrencyOptions extends View {
  get el() {
    return '#content-section'
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
    console.log('GiveCurrencyOptions initialize')
    this.gifting = this.model.get('gifting')

    // const stripePlans = this.model.get('stripePlans')
    // const currencies = stripePlans
    //   .map((obj) => {
    //     let currency = null
    //     if (obj.Term === 30 && obj.TermType === 'DAY') {
    //       currency = obj
    //     }
    //     return currency
    //   })
    //   .filter((item) => (item !== null))
    // console.log(currencies)
    // this.currencies = currencies

    // if (_.size(this.giveCurrencyOptions.get('lcurrencies')) > 1) {
    //   this.render()
    // }
    this.getCurrencies()
  }

  render() {
    console.log('GiveCurrencyOptions render')
    console.log(this.model.attributes)
    const attributes = {
      optionEls: this.currentOptions(),
    }
    const html = this.template(attributes)
    this
      .$('.give.store.container')
      .append(html)

    const currencyDesc = this.gifting.get('gift').CurrencyDesc
    this
      .$(`.give.store.container #currency-select option[value="${currencyDesc}"]`)
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

  getCurrencies() {
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
  }
}

export default GiveCurrencyOptions
