import { View } from 'backbone'
import template from './index.hbs'

class GiveLegal extends View {
  get el() {
    return '.give.store.container'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('GiveLegal initialize')

    this.model.set({
      specialDiscount: this.specialDiscount(),
    })

    this.render()
  }

  render() {
    console.log('GiveLegal render')
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
}

export default GiveLegal
