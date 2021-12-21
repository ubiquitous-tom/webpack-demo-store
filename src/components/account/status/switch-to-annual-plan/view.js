import { View } from 'backbone'
import _ from 'underscore'
import SubmitLoader from 'shared/elements/submit-loader'
import FlashMessage from 'shared/elements/flash-message'

import './stylesheet.scss'
import template from './index.hbs'

import SwitchToAnnualPlanModel from './model'
import ConfirmBilling from './confirm-billing'
import PromoCode from './promo-code/view'

class SwitchToAnnualPlan extends View {
  get el() {
    return '#account'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click button.confirm-upgrade': 'confirmUpgrade',
    }
  }

  initialize(options) {
    console.log('SwitchToAnnualPlan intialize')
    // console.log(options.monthlyPlan)
    this.submitLoader = new SubmitLoader()
    this.flashMessage = new FlashMessage()
    this.model = new SwitchToAnnualPlanModel(options.monthlyPlan.attributes)
    this.confirmBilling = new ConfirmBilling({ switchToAnnualPlan: this })
    this.promoCode = new PromoCode({ switchToAnnualPlan: this })
    console.log(this)
    this.render()

    this.model.set('promoCodeFieldDisplay', true)

    /* eslint no-shadow: 0 */
    this.listenTo(this.model, 'change:upgradeToAnnualSuccess', (model, value, options) => {
      console.log(model, value, options)
      console.log(this)
      debugger
      this.loadingStop()
      this.$el.find('.switch-to-annual-plan-container').remove()
      this.showFooter()

      this.flashMessage.onFlashMessageSet(this.model.get('flashMessage').message, this.model.get('flashMessage').type, true)
    })

    // Trigger Show/Hide promo code form in PromoCode View
    /* eslint no-unused-vars: 0 */
    this.listenTo(this.model, 'change:promoCodeFieldDisplay', (model, value, options) => {
      this.submitButtonDisplay(model, value, options)
      this.promoCode.promoCodeFieldDisplay(model, value, options)
    })
  }

  render() {
    console.log('SwitchToAnnualPlan render')
    // console.log(this.model.attributes)
    const data = {
      isPromoApplied: this.model.get('isPromoApplied') ? 'applied-success' : '',
      currSymbol: this.model.get('Customer').CurrSymbol,
      annualSubscriptionAmount: this.model.has('promoAppliedAmount')
        ? this.model.get('promoAppliedAmount')
        : this.model.get('annualStripePlan').SubscriptionAmount,
      nextBillingDate: this.model.get('Membership').NextBillingDate,
    }
    const html = this.template(data)
    // console.log(html)
    this.$el.append(html)

    this.promoCode.render()
    this.hideFooter()

    return this
  }

  confirmUpgrade() {
    console.log('SwitchToAnnualPlan confirmUpgrade')
    this.loadingStart()
    this.model.confirmUpgrade()
  }

  submitButtonDisplay(model, value, options) {
    if (value) {
      this.enableSubmit()
    } else {
      this.disableSubmit()
    }
  }

  enableSubmit() {
    console.log('SwitchToAnnualPlan enabledSubmit')
    // console.log(this.$el.find('.confirm-upgrade').prop('disabled'))
    this.$el.find('.confirm-upgrade').prop('disabled', false)
  }

  disableSubmit() {
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

  loadingStart() {
    this.disableSubmit()
    this.submitLoader.loadingStart(this.$el.find('.confirm-upgrade'))
  }

  loadingStop() {
    this.enableSubmit()
    this.submitLoader.loadingStop(this.$el.find('.confirm-upgrade'))
  }
}

export default SwitchToAnnualPlan
