import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import template from './index.hbs'

class GiveCurrencyOptions extends View {
  get el() {
    return '.give.store.container'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('GiveCurrencyOptions initialize')
    // const isLoggedIn = this.model.get('Session').LoggedIn
    // const isRecordedBook = (
    //   this.model.has('Membership')
    //   && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    // )
    // const isMonthlyMembership = (
    //   this.model.has('Membership') && this.model.get('Membership').Status === 'ACTIVE'
    //   && this.model.get('Membership').Term.toUpperCase() === 'MONTHLY'
    // )
    // const isWebPaymentEdit = (
    //   this.model.has('Customer')
    //   && this.model.get('Customer').webPaymentEdit === true
    // )

    // if (isMonthlyMembership || isWebPaymentEdit) {
    //   this.render()
    // }

    // if (_.size(this.model.get('plans').currencies() > 0)) {
    //   this.render()
    // }
  }

  render() {
    console.log('GiveCurrencyOptions render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.append(html)

    return this
  }

  currentOptions() {
    let options = ''
    _.each(this.model.get('plans').currencies(), (symbol, currency) => {
      options += `<option ${(currency === this.model.get('plans').defaultCurrency) ? 'selected' : ''} value="{{ currency }}-{{ symbol }}">{{ currency }}</option>`
    })

    return options
  }
}

export default GiveCurrencyOptions
