import Backbone, { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class MembershipCheckout extends View {
  get el() {
    return '#membership-options'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click a': 'checkout',
    }
  }

  initialize() {
    console.log('MembershipCheckout initialize')

    this.listenTo(this.model, 'membership:undelegateEvents', () => {
      console.log('MembershipCheckout garbageCollect')
      this.remove()
      // debugger
    })

    this.listenTo(this.model, 'membership:signedInCheckout', (value) => {
      console.log('membership:signedInCheckout', value)
      // debugger
      this.navigateTo()
    })

    this.render()
  }

  render() {
    console.log('MembershipCheckout render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.append(html)

    this.setElement('.checkout')

    return this
  }

  checkout(e) {
    console.log('MembershipCheckout checkout')
    e.preventDefault()

    this.navigateTo()
  }

  navigateTo() {
    const isLoggedIn = this.model.has('Subscription')
    const isStripeEnabled = this.model.get('Customer')?.StripeEnabled
    if (isLoggedIn) {
      if (isStripeEnabled) {
        Backbone.history.navigate('reviewPurchase', { trigger: true })
      } else {
        Backbone.history.navigate('editBilling', { trigger: true })
      }
      this.model.trigger('membership:undelegateEvents')
      // debugger
    } else {
      this.model.trigger('membership:checkout')
    }
  }
}

export default MembershipCheckout
