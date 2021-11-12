import { View } from 'backbone'
import _ from 'underscore'
import Handlebars from 'handlebars'

import './stylesheet.css'
import template from './index.html'
// import StripeForm from 'shared/stripe-form'
import SwitchToAnnualPlanModel from './model'
import ConfirmBilling from './confirm-billing'
import PromoCode from './promo-code/view'

class SwitchToAnnualPlan extends View {

  get el() {
    return '#account'
  }

  // get id() {
  //   return 'switch-to-annual-plan'
  // }

  get template() {
    return _.template(template)
  }

  get events() {
    return {
      // 'click a.cc-edit': 'editCreditCard',
      // 'click a.promocode-toggle': 'promocodeToggle',
      'click button.confirm-upgrade': 'confirmUpgrade',
    }
  }

  initialize(options) {
    console.log('SwitchToAnnualPlan intialize')
    // console.log(options.model)
    this.model = new SwitchToAnnualPlanModel(options.model.attributes)
    this.confirmBilling = new ConfirmBilling({ parent: this.model })
    this.promoCode = new PromoCode({ parent: this.model })
    console.log(this)
    // this.render()
    this.listenTo(this.model, 'sync', this.render)
  }

  render() {
    console.log('SwitchToAnnualPlan render')
    // console.log(this.$el[0])
    // console.log(this.template())
    const template = Handlebars.compile(this.template())
    // console.log(this.model.attributes)
    const html = template(this.model.attributes)
    // this.$el.html(this.template())
    this.$el.append(html)

    this.confirmBilling.render()
    this.promoCode.render()
    // this.addBackground()
    this.hideFooter()

    // this.stripeForm.render()

    return this
  }

  // editCreditCard(e) {
  //   e.preventDefault()
  //   console.log(this.$el[0])
  //   console.log(this.$el.find('#confirm-billing')[0])
  //   this.$el.find('#confirm-billing').empty()
  //   this.stripeForm = new StripeForm({ parent: this })
  //   console.log(this.stripeForm)
  //   this.stripeForm.render()
  // }

  // promocodeToggle(e) {
  //   e.preventDefault()
  //   console.log('toggle')
  //   console.log(this.$el[0])
  //   this.$el.find('#promocode-field').slideToggle()
  //   this.$el.find('.promocode-toggle span').toggleClass('glyphicon-menu-down').toggleClass('glyphicon-menu-right');
  // }

  confirmUpgrade() {
    console.log('SwitchToAnnualPlan confirmUpgrade')
    // this.removeBackground()
    this.model.confirmUpgrade()
    this.$el.find('.switch-to-annual-plan-container').remove()
    this.showFooter()
  }

  updateCard() {
    this.model.updateCard()
  }

  showFooter() {
    $('footer').show()
  }

  hideFooter() {
    $('footer').hide()
  }
}

export default SwitchToAnnualPlan
