import Backbone, { View } from 'backbone'
// import _ from 'underscore'

import template from './index.hbs'

import GiveCheckoutModal from './modal'

class GiveCheckout extends View {
  get el() {
    return '.give.store.container'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click a': 'checkout',
    }
  }

  initialize(options) {
    console.log('GiveCheckout initialize')
    this.i18n = options.i18n
    this.cart = this.model.get('cart')
    this.popup = new GiveCheckoutModal({ model: this.model, i18n: this.i18n })

    this.listenTo(this.model, 'give:undelegateEvents', () => {
      console.log('GiveCheckout garbageCollect')
      this.remove()
      // debugger
    })

    this.render()
  }

  render() {
    console.log('GiveCheckout render')
    console.log(this.model.attributes)
    const attributes = {
      discountRate: this.model.has('DiscountRate'),
    }
    const html = this.template(attributes)
    this.$el.append(html)

    this.setElement('#checkout-section')

    return this
  }

  specialDiscount() {
    // // Timeline Promotion.
    // const specialDiscount = this.model.has('DiscountRate') ? this.model.get('DiscountRate') : {}
    // if (!_.isEmpty(specialDiscount)) {
    //   _.each(specialDiscount, (item) => {
    //     item.defaultCurrency = this.plans.get('defaultCurrency')
    //     item.defaultCurrencySymbl = this.plans.get('defaultCurrencySymbl')
    //     item.displayPrice = item.defaultCurrency + item.defaultCurrencySymbl + item.Amount
    //     return item
    //   }, this)
    //   this.model.set('SeasonalPromotion', specialDiscount)
    // }
    return this.model.has('DiscountRate')
  }

  checkout(e) {
    console.log('GiveCheckout checkout')
    console.log(e)
    e.preventDefault()
    // const isLoggedIn = this.model.has('Subscription')
    // debugger
    if (this.cart.getItemQuantity('gift')) {
      Backbone.history.navigate('editBilling', { trigger: true })
      this.model.trigger('give:undelegateEvents')
    } else {
      // Error popup here with Gift quantity of at least 1 requirement
      this.popup.render()
      $('body')[0].scrollIntoView({ behavior: 'smooth' })
    }
  }
}

export default GiveCheckout
