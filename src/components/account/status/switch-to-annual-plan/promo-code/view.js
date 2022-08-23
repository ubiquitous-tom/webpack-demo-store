import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import SubmitLoader from 'shared/elements/submit-loader'
import FlashMessage from 'shared/elements/flash-message'
import template from './index.hbs'
import PromoCodeModel from './model'
// import ATVView from 'core/view'

class PromoCode extends View {
  get el() {
    return '#account'
  }

  get template() {
    return template
  }

  get events() {
    return {
      // 'click a.promocode-toggle': 'promocodeToggle',
      'input input#promocode': 'toUpperCase',
      'blur input#promocode': 'clearErrorMessage',
      // 'click #promocode-field button[type="reset"]': 'reset',
      'click #promocode-field button[type="submit"]': 'submit',
    }
  }

  initialize(options) {
    console.log('Promocode initialize')
    console.log(this, options)
    this.i18n = options.i18n
    this.switchToAnnualPlan = options.switchToAnnualPlan
    // this.confirmBilling = this.switchToAnnualPlan.confirmBilling
    // this.model = this.switchToAnnualPlan.model
    this.model = new PromoCodeModel()
    this.submitLoader = new SubmitLoader()
    this.flashMessage = new FlashMessage()
    // this.listenTo(this.model, 'change', this.render)
    // this.render()

    /* eslint no-shadow: 0 */
    this.listenTo(this.model, 'change:promoCodeSuccess', (model, value, options) => {
      console.log(model, value, options)
      console.log(this)
      debugger
      model.unset('promoCodeSuccess', { silent: true })
      this.loadingStop()
      if (value) {
        this.updatePromoMessage(model, value, options)
      } else {
        this.flashMessage.onFlashMessageShow(model.get('flashMessage').message, model.get('flashMessage').type)
      }
    })

    /* eslint no-unused-vars: 0 */
    this.listenTo(this.model, 'change:promoAppliedAmount', (model, value, options) => {
      const subscriptionAmount = this.switchToAnnualPlan.model.get('annualStripePlan').SubscriptionAmount
      const discountedPrice = subscriptionAmount - ((value * subscriptionAmount) / 100)
      const promoAppliedAmount = (Math.floor(discountedPrice * 100) / 100).toFixed(2)
      const pricing = this.switchToAnnualPlan.model.get('annualStripePlan').CurrSymbol + promoAppliedAmount
      this.$el.find('.annual-plan-message span').addClass('applied-success').html(pricing)
      this.$el.find('#billing-container .legal-notice span').html(pricing)
    })

    this.listenTo(this.model, 'change:promoCode', (model, value, options) => {
      debugger
      this.switchToAnnualPlan.model.set('promoCode', value)
    })

    this.model.on('error', (model, value, options) => {
      console.log('Promocode initialize on error')
      // console.log(model, value, options)
      // console.log(this.$el[0])
      // console.log(this.$el.find('#promocode-field .form-group')[0])
      debugger
      this.$el.find('#promocode-field .form-group').addClass('has-error')
    })
  }

  render() {
    console.log('Promocode render')
    // console.log(this.$el[0])
    // console.log(this.$el.find('.switch-to-annual-plan-container')[0])
    // console.log(this.$el.find('#promocode-container')[0])
    const html = this.template(this.model.attributes)
    // console.log(html)
    this.$el.find('#promocode-container').append(html)
    // this.$el.html(html)
  }

  promocodeToggle(e) {
    e.preventDefault()
    // console.log('toggle')
    // console.log(this.$el[0])
    this.$el.find('#promocode-field').slideToggle()
    this.$el.find('.promocode-toggle span').toggleClass('glyphicon-menu-down').toggleClass('glyphicon-menu-right')
  }

  toUpperCase(e) {
    // console.log(e)
    const input = e.target.value.toUpperCase()
    // console.log(input)
    // console.log(this.$el.find(e.currentTarget)[0])
    this.$el.find(e.currentTarget).val(input)
  }

  clearErrorMessage(e) {
    e.preventDefault()
    _.debounce($(e.target).parent('.form-group').removeClass('has-error'), 500)
  }

  reset(e) {
    console.log('Promocode reset')
    e.preventDefault()
    console.log(e)
  }

  submit(e) {
    console.log('Promocode submit')
    e.preventDefault()
    console.log(e)
    this.loadingStart()
    const promoCode = this.$el.find('input#promocode').val()
    this.model.submit(promoCode)
  }

  // This function is called in SwitchToAnnualPlan() View
  promoCodeFieldDisplay(model, value, options) {
    console.log('Promocode promoCodeFieldDisplay')
    // console.log(model, value, options)
    if (value) {
      this.showPromoCode(model)
    } else {
      this.hidePromoCode(model)
    }
  }

  showPromoCode(model) {
    // console.log(this, model)
    // console.log(this.$el[0], this.$el.find('#promocode-container')[0])
    this.$el.find('#promocode-container').show()
  }

  hidePromoCode(model) {
    // console.log(this, model)
    // console.log(this.$el[0], this.$el.find('#promocode-container')[0])
    this.$el.find('#promocode-container').hide()
  }

  updatePromoMessage(model, value, options) {
    console.log('Promocode updatePromoMessage')
    debugger
    const promoCodeAppliedSuccess = $('<div>').addClass('promocode-applied-success')
    const i = $('<i>').addClass('glyphicon glyphicon-ok')
    const message = this.i18n.t(model.get('flashMessage').message, model.get('flashMessage').interpolationOptions)

    const container = this.$el.find('#promocode-container')
    /* eslint comma-dangle: 0 */
    container
      .empty()
      .append(
        promoCodeAppliedSuccess
          .append(i)
          .append(message)
      )
      .show()
  }

  loadingStart() {
    this.$el.find('#promocode-container input').prop('disabled', true)
    this.submitLoader.loadingStart(this.$el.find('#promocode-container button[type="submit"]'))
  }

  loadingStop() {
    this.$el.find('#promocode-container input').prop('disabled', false)
    this.submitLoader.loadingStop(this.$el.find('#promocode-container button[type="submit"]'))
  }
}

export default PromoCode
