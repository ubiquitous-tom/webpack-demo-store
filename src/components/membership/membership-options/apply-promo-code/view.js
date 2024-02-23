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
      'submit #apply-promo-code-form': 'applyPromoCode',
      'click #promo-clear': 'clearPromoCode',
    }
  }

  initialize(options) {
    console.log('MembershipApplyPromoCode initialize')
    this.i18n = options.i18n
    this.cart = this.model.get('cart')
    this.gifting = this.model.get('gifting')
    this.membershipApplyPromoCodeModel = new MembershipApplyPromoCodeModel()

    this.listenTo(this.model, 'membership:undelegateEvents', () => {
      console.log('MembershipApplyPromoCode garbageCollect')
      this.remove()
      // debugger
    })

    /* eslint no-shadow: 0 */
    this.listenTo(this.membershipApplyPromoCodeModel, 'change:promoCodeSuccess', (model, value) => {
      console.log(model, value)
      console.log(this, this.model.attributes)
      // debugger
      model.unset('promoCodeSuccess', { silent: true })
      let { message } = model.get('flashMessage')
      let type = false
      if (value) {
        const membershipPromo = this.membershipApplyPromoCodeModel.get('promo')
        if (!_.isEmpty(membershipPromo.SourceCodeMapping)) {
          type = true
          this.model.set({ membershipPromo }, { context: this })
        } else {
          message = this.i18n.t('PROMOCODE-ERROR')
        }
      }
      this.updatePromoMessage(message, type)
      console.log(this.model.attributes)
    })

    const membershipActive = (this.model.get('Membership').Status.toUpperCase() === 'ACTIVE')
    if (!membershipActive) {
      this.render()
    }
  }

  render() {
    console.log('MembershipApplyPromoCode render')
    console.log(this.model.attributes)
    const html = this.template()
    if (this.$('#signUpForm').length) {
      this.$('#signUpForm').replaceWith(html)
    } else {
      this.$el.append(html)
    }

    this.setElement('#membership-info-promo')

    if (this.model.has('membershipPromo')) {
      // debugger
      const promoCode = this.model.get('membershipPromo').PromotionCode
      const stripePercentOff = this.model.get('membershipPromo').StripePercentOff
      const message = `${promoCode} applied. Enjoy your ${stripePercentOff}% off!`
      this.$('#promo-code').val(promoCode)
      this.updatePromoMessage(message, 'success')
    }

    return this
  }

  applyPromoCode(e) {
    console.log('MembershipApplyPromoCode applyPromoCode')
    e.preventDefault()
    const promoCode = this.$('#promo-code').val()
    this.membershipApplyPromoCodeModel.submit(promoCode)
  }

  clearPromoCode(e) {
    console.log('MembershipApplyPromoCode clearPromoCode')
    e.preventDefault()
    console.log(e)
    // debugger
    this.model.unset('membershipPromo', { context: this })

    this.clearPromoMessage()
  }

  clearPromoMessage() {
    console.log('MembershipApplyPromoCode clearPromoMessage')
    const container = this.$('#apply-promo-code')
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

    const container = this.$('#apply-promo-code')
    const promoInput = container.find('#promo-code')
    const button = container.find('button')
    const buttonWidth = button.outerWidth()
    const xIcon = $('<i>').addClass('fa fa-times-thin fa-2x').attr({ 'aria-hidden': true })
    const promoClear = $('<a>').attr('id', 'promo-clear').append(xIcon)
    /* eslint comma-dangle: 0 */
    // remove old promo message
    container
      .find('.promo-message')
      .remove()
    // remove old promo-clear
    container
      .find('#promo-clear')
      .remove()

    // disable promo field and button
    // if the promo code is good then disable the input
    // DWT1-1020
    if (value) {
      promoInput
        .prop('disabled', true)
    }
    promoInput
      .after(promoClear)

    // if the promo code is good then disable the button
    // DWT1-1020
    if (value) {
      button
        .prop('disabled', true)
        .css({
          width: buttonWidth,
          background: '#afafaf',
          color: '#000',
          fontWeight: 700,
        })
        .html(this.i18n.t('APPLIED-PROMO-CODE'))
    }

    // display new promo message
    let promoMessage = message

    // if the promo code is bad then show customized message required by the Product owner.
    // DWT1-1020
    if (!value) {
      if (message.includes('expired')) {
        promoMessage = this.i18n.t('EXPIRED-PROMO-CODE-2024')
      }

      if (message.includes('not exist')) {
        promoMessage = this.i18n.t('PROMOCODE-ERROR')
      }
    }

    container
      .find('.form-group')
      .append(
        promoCodeApplied
          .addClass(promoCodeAppliedType)
          // .append(i)
          .append(promoMessage)
      )
  }
}

export default MembershipApplyPromoCode
