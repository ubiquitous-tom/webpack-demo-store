import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

import GiveTagline from './tagline'
import GiveSignIn from './sign-in'
import GiveCurrencyOptions from './currency-options'
import GiveGiftMembership from './gift-membership'
import GiveAnnualMembership from './annual-membership'
import GiveCheckout from './checkout'
import GiveLegal from './legal'

class Give extends View {
  get el() {
    return '#content-section'
  }

  get template() {
    return template
  }

  initialize(options) {
    console.log('Give initialize')
    this.i18n = options.i18n

    this.model.set({
      storeType: 'Gift',
    })

    this.listenTo(this.model.get('cart'), 'change:annual', this.render)

    this.render()
  }

  render() {
    console.log('Give render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.html(html)

    this.resetMonthlyMembershipQuantity()

    this.giveTagline = new GiveTagline({ model: this.model, i18n: this.i18n })
    this.giveSignIn = new GiveSignIn({ model: this.model, i18n: this.i18n })
    this.giveCurrencyOptions = new GiveCurrencyOptions({ model: this.model, i18n: this.i18n })
    this.giveGiftMembership = new GiveGiftMembership({ model: this.model, i18n: this.i18n })
    this.giveAnnualMembership = new GiveAnnualMembership({ model: this.model, i18n: this.i18n })
    this.giveCheckout = new GiveCheckout({ model: this.model, i18n: this.i18n })
    this.giveLegal = new GiveLegal({ model: this.model, i18n: this.i18n })

    this.model.set({
      giveAnnualMembership: this.giveAnnualMembership,
    })

    return this
  }

  resetMonthlyMembershipQuantity() {
    const quantity = 0
    const amount = (this.model.has('membershipPromo'))
      ? this.model.get('cart')?.get('monthly')?.amount
      : this.model.get('monthlyStripePlan')?.SubscriptionAmount
    const total = 0
    const membership = {
      monthly: {
        quantity,
        amount,
        total,
      },
    }
    this.model.get('cart').set(membership)
  }
}

export default Give
