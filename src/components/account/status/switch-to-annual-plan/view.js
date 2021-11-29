import { View } from 'backbone'
import _, { times } from 'underscore'
import Handlebars from 'handlebars'

import './stylesheet.scss'
import template from './index.html'

import SwitchToAnnualPlanModel from './model'
import ConfirmBilling from './confirm-billing'
import PromoCode from './promo-code/view'
import FlashMessage from 'shared/elements/flash-message'

class SwitchToAnnualPlan extends View {

  get el() {
    return '#account'
  }

  get template() {
    return _.template(template)
  }

  get events() {
    return {
      'click button.confirm-upgrade': 'confirmUpgrade',
    }
  }

  initialize(options) {
    console.log('SwitchToAnnualPlan intialize')
    // console.log(options.monthlyPlan)
    this.dispatcher = options.dispatcher
    this.flashMessage = new FlashMessage()
    this.model = new SwitchToAnnualPlanModel(options.monthlyPlan.attributes)
    this.confirmBilling = new ConfirmBilling({ switchToAnnualPlan: this })
    this.promoCode = new PromoCode({ switchToAnnualPlan: this })
    console.log(this)
    this.render()


    this.model.set('promoCodeFieldDisplay', true)

    this.listenTo(this.model, 'change:upgradeToAnnualSuccess', (model, value, options) => {
      console.log(model, value, options)
      console.log(this)
      debugger
      this.$el.find('.switch-to-annual-plan-container').remove()
      this.showFooter()
      // this.dispatcher.trigger('subscription:updated', this)
      this.flashMessage.onFlashMessageSet(this.model.get('flashMessage').message, this.model.get('flashMessage').type)
      this.dispatcher.trigger('upgradeToAnnual:success', this)
    })

    // Trigger Show/Hide promo code form in PromoCode View
    this.listenTo(this.model, 'change:promoCodeFieldDisplay', (model, value, options) => {
      this.submitButtonDisplay(model, value, options)
      this.promoCode.promoCodeFieldDisplay(model, value, options)
    })
  }

  render() {
    console.log('SwitchToAnnualPlan render')
    // console.log(this.$el[0])
    // console.log(this.template())
    const template = Handlebars.compile(this.template())
    // console.log(this.model.attributes)
    const data = {
      isPromoApplied: this.model.get('isPromoApplied') ? 'applied-success' : '',
      currSymbol: this.model.get('Customer').CurrSymbol,
      annualSubscriptionAmount: this.model.has('promoAppliedAmount')
        ? this.model.get('promoAppliedAmount')
        : this.model.get('annualStripePlan').SubscriptionAmount,
    }
    const html = template(data)
    // console.log(html)
    this.$el.append(html)

    this.promoCode.render()
    this.hideFooter()

    return this
  }

  confirmUpgrade() {
    console.log('SwitchToAnnualPlan confirmUpgrade')
    this.model.confirmUpgrade()
  }

  submitButtonDisplay(model, value, options) {
    if (value) {
      this.enableSubmit(model)
    } else {
      this.disableSubmit(model)
    }
  }

  enableSubmit(model) {
    console.log('SwitchToAnnualPlan enabledSubmit')
    // console.log(this.$el.find('.confirm-upgrade').prop('disabled'))
    this.$el.find('.confirm-upgrade').prop('disabled', false)
  }

  disableSubmit(model) {
    console.log('SwitchToAnnualPlan disableSubmit')
    // console.log(this.$el[0], this.$el.find('.confirm-upgrade')[0])
    this.$el.find('.confirm-upgrade').prop('disabled', true)
  }

  showFooter() {
    $('footer').show()
  }

  hideFooter() {
    $('footer').hide()
  }
}

export default SwitchToAnnualPlan
