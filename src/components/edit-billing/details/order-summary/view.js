import { View } from 'backbone'
// import _ from 'underscore'

import './stylesheet.scss'
import template from './index.hbs'

import EditBillingDetailsOrderSummaryMonthly from './partials/monthly'
import EditBillingDetailsOrderSummaryAnnual from './partials/annual'
import EditBillingDetailsOrderSummaryGift from './partials/gift'
import EditBillingDetailsOrderSummaryTotal from './partials/total'

class EditBillingDetailsOrderSummary extends View {
  get el() {
    return '#edit-billing-details'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click #updateOrder': 'updateOrder',
    }
  }

  initialize() {
    console.log('EditBillingDetailsOrderSummary initialize')
    this.gifting = this.model.get('gifting')
    this.cart = this.model.get('cart')

    this.render()
  }

  render() {
    console.log('EditBillingDetailsOrderSummary render')
    console.log(this.model.attributes)
    // const attributes = {
    //   orderTotal: this.orderTotal(),
    // }
    const html = this.template()
    this.$el.append(html)

    this.editBillingDetailsOrderSummaryMonthly = new EditBillingDetailsOrderSummaryMonthly({
      model: this.model,
    })
    this.editBillingDetailsOrderSummaryAnnual = new EditBillingDetailsOrderSummaryAnnual({
      model: this.model,
    })
    this.editBillingDetailsOrderSummaryGift = new EditBillingDetailsOrderSummaryGift({
      model: this.model,
    })
    this.editBillingDetailsOrderSummaryTotal = new EditBillingDetailsOrderSummaryTotal({
      model: this.model,
    })

    return this
  }

  updateOrder(e) {
    e.preventDefault()
    Backbone.history.navigate('give', { trigger: true })

    // if (giveObj.get("Type") == 'Membership') {
    //   Backbone.trigger('navClick', 'membership');
    // } else {
    //   Backbone.trigger('navClick', 'give');
    // }
  }

  // orderTotal() {
  //   const total = this.cart.getTotalAmount()
  //   return [
  //     this.gifting.get('gift').CurrencyDesc,
  //     this.gifting.get('gift').CurrSymbol,
  //     total,
  //   ].join('')
  // }
}

export default EditBillingDetailsOrderSummary
