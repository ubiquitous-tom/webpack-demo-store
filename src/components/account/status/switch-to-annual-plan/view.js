import { View } from 'backbone'
import _ from 'underscore'
import Handlebars from 'handlebars'

import './stylesheet.scss'
import template from './index.html'

import SwitchToAnnualPlanModel from './model'
import ConfirmBilling from './confirm-billing'
import PromoCode from './promo-code/view'
import FlashMessage from 'shared/elements/flash-message/view'

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
    this.flashMessage = new FlashMessage({ dispatcher: this.dispatcher })
    this.model = new SwitchToAnnualPlanModel(options.monthlyPlan.attributes)
    this.confirmBilling = new ConfirmBilling({ switchToAnnualPlanModel: this.model, dispatcher: this.dispatcher })
    this.promoCode = new PromoCode({ switchToAnnualPlanModel: this.model, dispatcher: this.dispatcher })
    console.log(this)
    this.render()

    this.listenTo(this.model, 'change:upgradeToAnnualSuccess', (model, value, options) => {
      console.log(model, value, options)
      console.log(this)
      debugger
      this.$el.find('.switch-to-annual-plan-container').remove()
      this.showFooter()
      // this.dispatcher.trigger('subscription:updated', this)
      this.dispatcher.trigger('flashMessage:set', this.model.get('flashMessage').message, this.model.get('flashMessage').type)
      this.dispatcher.trigger('upgradeToAnnual:success', this)
    })

    this.dispatcher.on('promoCode:hide', this.disableSubmit, this)
    this.dispatcher.on('promoCode:show', this.enableSubmit, this)
  }

  render() {
    console.log('SwitchToAnnualPlan render')
    // console.log(this.$el[0])
    // console.log(this.template())
    const template = Handlebars.compile(this.template())
    // console.log(this.model.attributes)
    const html = template(this.model.attributes)
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

  enableSubmit(model) {
    console.log('SwitchToAnnualPlan enabledSubmit')
    // console.log(this.$el.find('.confirm-upgrade').prop('disabled'))
    if (this.$el.find('.confirm-upgrade').prop('disabled')) {
      this.$el.find('.confirm-upgrade').prop('disabled', false)
    }
  }

  disableSubmit(model) {
    console.log('SwitchToAnnualPlan disableSubmit')
    // console.log(this, model)
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
