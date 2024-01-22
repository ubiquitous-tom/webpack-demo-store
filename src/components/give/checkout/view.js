import { View } from 'backbone'
import template from './index.hbs'

class GiveCheckout extends View {
  get el() {
    return '.give.store.container'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click .checkout a': 'checkout',
    }
  }

  initialize() {
    console.log('GiveCheckout initialize')

    this.model.set({
      specialDiscount: this.specialDiscount(),
    })

    this.render()
  }

  render() {
    console.log('GiveCheckout render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.append(html)

    return this
  }

  specialDiscount() {
    // Timeline Promotion.
    // var specialDiscount = this.model.has('DiscountRate') ? this.model.get('DiscountRate') : {};
    // if (!_.isEmpty(specialDiscount)) {
    //   _.each(specialDiscount, function (item) {
    //     item.defaultCurrency = this.plans.get('defaultCurrency');
    //     item.defaultCurrencySymbl = this.plans.get('defaultCurrencySymbl');
    //     item.displayPrice = item.defaultCurrency + item.defaultCurrencySymbl + item.Amount;
    //     return item;
    //   }, this);
    //   giveObj.set("SeasonalPromotion", specialDiscount);
    // }
    return this.model.has('DiscountRate')
  }

  checkout(e) {
    console.log('GiveCheckout checkout')
    console.log(e)
    e.preventDefault()
    const isLoggedIn = this.model.has('Subscription')
    debugger
    if (isLoggedIn) {
      Backbone.History.nagivate('editBilling')
    } else {
      this.$el.find('.giveDetails')[0].scrollIntoView({ behavior: 'smooth' })
    }
  }
}

export default GiveCheckout
