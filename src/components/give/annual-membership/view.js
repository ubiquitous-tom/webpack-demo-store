import { View } from 'backbone'

import './stylesheet.scss'
import MembershipUser from './img/membership-user.png'
import template from './index.hbs'

class GiveAnnualMembership extends View {
  get el() {
    return '.give.store.container'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click .remove a': 'removeAnnualMembership',
    }
  }

  initialize() {
    console.log('GiveAnnualMembership initialize')
    console.log(this.model.attributes)
    this.cart = this.model.get('cart')

    // giveObj.get("Membership").quantity == 0 ? ' hide' : ''
    // const isAnnualMembership = this.cart.has('annual')
    const isAnnualMembershipQuantity = (this.cart.get('annual')?.quantity > 0)
    if (isAnnualMembershipQuantity) {
      const annualPlanPrice = [
        this.model.get('annualStripePlan').CurrencyDesc,
        this.model.get('annualStripePlan').CurrSymbol,
        this.model.get('annualStripePlan').SubscriptionAmount,
      ].join('')

      this.model.set({
        MembershipUser,
        annualPlanPrice,
      })
      this.render()
    }
  }

  render() {
    console.log('GiveAnnualMembership render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.append(html)

    return this
  }

  removeAnnualMembership(e) {
    console.log('GiveAnnualMembership removeAnnualMembership')
    e.preventDefault()
    const quantity = 0
    const amount = (this.model.has('membershipPromo'))
      ? this.model.get('cart')?.get('annual')?.amount
      : this.model.get('annualStripePlan')?.SubscriptionAmount
    const total = 0
    const membership = {
      annual: {
        quantity,
        amount,
        total,
      },
    }
    this.model.get('cart').set(membership)
  }
}

export default GiveAnnualMembership
