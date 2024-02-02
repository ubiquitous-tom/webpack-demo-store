import { Model, View } from 'backbone'

import './stylesheet.scss'
import membershipUserImg from './img/membership-user.png'
import template from './index.hbs'

class GiveAnnualMembership extends View {
  get el() {
    return '#membershipItem'
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

    this.giveAnnualMembership = new Model()

    this.listenTo(this.model, 'give:undelegateEvents', () => {
      console.log('GiveAnnualMembership garbageCollect')
      this.remove()
      // debugger
    })

    this.listenTo(this.model.get('cart'), 'change:annual', (model, value) => {
      console.log(model, value)
      if (value.quantity) {
        this.$el.slideDown()
      } else {
        this.hideAnnualSubscription()
      }
    })

    // giveObj.get("Membership").quantity == 0 ? ' hide' : ''
    // const isAnnualMembership = this.cart.has('annual')
    // if (this.cart.get('annual').quantity) {
    const annualAmount = this.model.get('annualStripePlan').SubscriptionAmount
    const annualPlanID = this.model.get('annualStripePlan').PlanID
    const annualPlanPrice = [
      this.model.get('annualStripePlan').CurrencyDesc,
      this.model.get('annualStripePlan').CurrSymbol,
      this.model.get('annualStripePlan').SubscriptionAmount,
    ].join('')

    this.giveAnnualMembership.set({
      annualAmount,
      annualPlanID,
      membershipUserImg,
      annualPlanPrice,
    })

    this.render()
    // }
  }

  render() {
    console.log('GiveAnnualMembership render')
    console.log(this.model.attributes, this.giveAnnualMembership.attributes)
    const html = this.template(this.giveAnnualMembership.attributes)
    this.$el
      .css({ display: 'none' })
      .append(html)

    // this.$('#membershipItem').slideDown()

    return this
  }

  removeAnnualMembership(e) {
    console.log('GiveAnnualMembership removeAnnualMembership')
    e.preventDefault()

    this.hideAnnualSubscription()
  }

  hideAnnualSubscription() {
    this.$el.slideUp(500, () => {
      const quantity = 0
      const amount = (this.model.has('membershipPromo'))
        ? this.cart.get('annual')?.amount
        : this.model.get('annualStripePlan')?.SubscriptionAmount
      const total = 0
      const membership = {
        annual: {
          quantity,
          amount,
          total,
        },
      }
      this.cart.set(membership)
    })
  }
}

export default GiveAnnualMembership
