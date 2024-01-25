import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import template from './index.hbs'

import MembershipApplyPromoCodeModel from './model'

class MembershipApplyPromoCode extends View {
  get el() {
    return '#membership-options'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click #apply-promo-code button': 'applyPromoCode',
      'click #promo-clear': 'clearPromoCode',
    }
  }

  initialize(options) {
    console.log('MembershipApplyPromoCode initialize')
    this.i18n = options.i18n
    this.cart = this.model.get('cart')
    this.gifting = this.model.get('gifting')
    this.membershipApplyPromoCodeModel = new MembershipApplyPromoCodeModel()

    /* eslint no-shadow: 0 */
    this.listenTo(this.membershipApplyPromoCodeModel, 'change:promoCodeSuccess', (model, value) => {
      console.log(model, value)
      console.log(this, this.model.attributes)
      // debugger
      model.unset('promoCodeSuccess', { silent: true })
      // this.loadingStop()
      if (value) {
        let { message } = model.get('flashMessage')
        let type = true
        const membershipPromo = this.membershipApplyPromoCodeModel.get('promo')
        if (!_.isEmpty(membershipPromo.SourceCodeMapping)) {
          this.model.set({ membershipPromo }, { context: this })
        } else {
          message = this.i18n.t('PROMOCODE-NOT-FOUND')
          type = false
        }
        this.updatePromoMessage(message, type)
      }
      console.log(this.model.attributes)
    })

    // const isGroupNameAllowedGifting = true // this.model.get('isGroupNameAllowedGifting')
    const membershipActive = (this.model.get('Membership').Status.toUpperCase() === 'ACTIVE')
    if (!membershipActive) {
      this.render()
    }
  }

  render() {
    console.log('MembershipApplyPromoCode render')
    console.log(this.model.attributes)
    const html = this.template()
    if (this.$el.find('#signUpForm').length) {
      this.$el.find('#signUpForm').replaceWith(html)
    } else {
      this.$el.append(html)
    }

    if (this.model.has('membershipPromo')) {
      // debugger
      const promoCode = this.model.get('membershipPromo').PromotionCode
      const stripePercentOff = this.model.get('membershipPromo').StripePercentOff
      const message = `${promoCode} applied. Enjoy your ${stripePercentOff}% off!`
      this.$el.find('#promo-code').val(promoCode)
      this.updatePromoMessage(message, 'success')
    }

    return this
  }

  applyPromoCode(e) {
    console.log('MembershipApplyPromoCode applyPromoCode')
    e.preventDefault()
    const promoCode = this.$el.find('#promo-code').val()
    this.membershipApplyPromoCodeModel.submit(promoCode)
  }

  clearPromoCode(e) {
    console.log('MembershipApplyPromoCode clearPromoCode')
    e.preventDefault()
    console.log(e)
    // debugger
    // this.cart.unset('promoCodeApplied', { context: this })
    this.model.unset('membershipPromo', { context: this })

    this.clearPromoMessage(e)
  }

  clearPromoMessage(e) {
    console.log('MembershipApplyPromoCode clearPromoMessage')
    e.preventDefault()
    console.log(e)

    const container = this.$el.find('#apply-promo-code')
    const promoInput = container.find('#promo-code')
    const button = container.find('button')
    const promoMessage = container.find('.promo-message')
    const promoClear = container.find('#promo-clear')

    promoInput
      .prop('disabled', false)
      .val('')

    promoClear
      .remove()

    button
      .prop('disabled', false)
      .removeAttr('style')
      .html(this.i18n.t('APPLY-CODE'))

    promoMessage.remove()
  }

  updatePromoMessage(message, value) {
    console.log('MembershipApplyPromoCode updatePromoMessage')
    // debugger
    const promoCodeApplied = $('<div>').addClass('col-md-9 promo-message text-center pull-right')
    const promoCodeAppliedType = value ? 'success' : 'error'
    // const i = $('<i>').addClass('glyphicon glyphicon-ok')

    // const { message } = model.get('flashMessage')

    const container = this.$el.find('#apply-promo-code')
    const promoInput = container.find('#promo-code')
    const button = container.find('button')
    const buttonWidth = button.outerWidth()
    const xIcon = $('<i>').addClass('fa fa-times-thin fa-2x').attr({ 'aria-hidden': true })
    const promoClear = $('<a>').attr('id', 'promo-clear').append(xIcon)
    /* eslint comma-dangle: 0 */
    // remove old promo message
    container
      .find('.promo-message')
      .empty()

    // disable promo field and button
    promoInput
      .prop('disabled', true)
      .after(promoClear)

    button
      .prop('disabled', true)
      .css({
        width: buttonWidth,
        background: '#afafaf',
        color: '#000'
      })
      .html(this.i18n.t('APPLIED-PROMO-CODE'))

    // display new promo message
    container
      // .empty()
      .find('.form-group')
      .append(
        promoCodeApplied
          .addClass(promoCodeAppliedType)
          // .append(i)
          .append(message)
      )
    // .show()
  }
}

export default MembershipApplyPromoCode
