import Backbone, { Model, View } from 'backbone'
import _ from 'underscore'

import PaymentEstimation from 'core/models/payment-estimation'

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

  initialize(options) {
    console.log('EditBillingDetailsOrderSummary initialize')
    this.i18n = options.i18n
    this.gifting = this.model.get('gifting')
    this.cart = this.model.get('cart')
    this.paymentEstimation = new PaymentEstimation()
    this.orderSumamary = new Model()

    this.orderSumamary.set({
      estimatedTaxPrice: this.i18n.t('TAX-APPLICABLE'),
    })

    // if the customer is logged in
    if (this.model.has('BillingAddress')) {
      const {
        Country,
        PostalCode,
      } = this.model.get('BillingAddress')

      if (!_.isEmpty(Country) && !_.isEmpty(PostalCode)) {
        const data = {
          Country,
          PostalCode,
          Amount: this.cart.getTotalAmount(),
        }
        this.paymentEstimation.getPaymentEstimation(data)
      }
    }

    this.listenTo(this.model, 'editBilling:undelegateEvents', () => {
      console.log('EditBillingDetailsOrderSummary garbageCollect')
      this.remove()
      // debugger
    })

    // this.listenTo(this.model, 'change:editBillingForm', (model, value) => {
    //   const data = {
    //     Country: value.address_country,
    //     PostalCode: value.address_zip,
    //     Amount: this.cart.getTotalAmount(),
    //   }
    //   this.paymentEstimation.getPaymentEstimation(data)
    // })

    this.listenTo(this.paymentEstimation, 'change:paymentEstimationSuccess', (model, value) => {
      console.log(model, value)
      // debugger
      const taxInfo = parseFloat(model.get('TotalTaxCalculated').toFixed(2))
      if (taxInfo > 0) {
        const estimatedTax = [
          this.gifting.get('gift').CurrencyDesc,
          this.gifting.get('gift').CurrSymbol,
          taxInfo,
        ].join('')
        const translatedText = this.i18n.t('TAX-ESTIMATED-TAXES-HANDLEBARS', { estimatedTax })
        this
          .$('.order-summary')
          .find('.tax-placeholder')
          .html(translatedText)
      }
    })

    this.render()
  }

  render() {
    console.log('EditBillingDetailsOrderSummary render')
    console.log(this.model.attributes)
    const attributes = {
      estimatedTaxPrice: this.orderSumamary.get('estimatedTaxPrice'),
    }
    const html = this.template(attributes)
    this.$el.append(html)

    this.editBillingDetailsOrderSummaryMonthly = new EditBillingDetailsOrderSummaryMonthly({
      model: this.model,
      i18n: this.i18n,
      parentView: this,
    })
    this.editBillingDetailsOrderSummaryAnnual = new EditBillingDetailsOrderSummaryAnnual({
      model: this.model,
      i18n: this.i18n,
      parentView: this,
    })
    this.editBillingDetailsOrderSummaryGift = new EditBillingDetailsOrderSummaryGift({
      model: this.model,
      i18n: this.i18n,
      parentView: this,
    })
    this.editBillingDetailsOrderSummaryTotal = new EditBillingDetailsOrderSummaryTotal({
      model: this.model,
      i18n: this.i18n,
      parentView: this,
    })

    return this
  }

  updateOrder(e) {
    e.preventDefault()
    if (this.cart.getTotalQuantity() !== 0) {
      if (this.model.get('storeType') === 'Gift') {
        Backbone.history.navigate('give', { trigger: true })
      } else {
        Backbone.history.navigate('membership', { trigger: true })
      }
      this.model.trigger('editBilling:undelegateEvents')
    }
  }

  promoMessageFormatter(promoMessage) {
    const newPromoMessage = promoMessage.split('.')

    return _.isArray(newPromoMessage) ? newPromoMessage[1].trim() : promoMessage
  }
}

export default EditBillingDetailsOrderSummary
