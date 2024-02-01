import Backbone, { View } from 'backbone'
// import _ from 'underscore'

import template from './index.hbs'

import GiveCheckoutModal from './modal/view'

class GiveCheckout extends View {
  get el() {
    return '#content-section'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click .checkout a': 'checkout',
    }
  }

  initialize(options) {
    console.log('GiveCheckout initialize')
    this.i18n = options.i18n
    this.cart = this.model.get('cart')
    this.modal = new GiveCheckoutModal({ model: this.model, i18n: this.i18n })

    // this.render()
  }

  render() {
    console.log('GiveCheckout render')
    console.log(this.model.attributes)
    const attributes = {
      discountRate: this.model.has('DiscountRate'),
    }
    const html = this.template(attributes)
    this
      .$('.give.store.container')
      .append(html)

    return this
  }

  checkout(e) {
    console.log('GiveCheckout checkout')
    console.log(e)
    e.preventDefault()
    // const isLoggedIn = this.model.has('Subscription')
    // debugger
    if (this.cart.getItemQuantity('gift')) {
      Backbone.history.navigate('editBilling', { trigger: true })
    } else {
      // Error popup here with Gift quantity of at least 1 requirement
      this.modal.render()
      this.$el.find('.giveDetails')[0].scrollIntoView({ behavior: 'smooth' })
    }
  }
}

export default GiveCheckout
