import { View } from 'backbone'
import _ from 'underscore'

import PromoValidateModel from 'core/models/promo-validate'

import './stylesheet.scss'
import template from './index.hbs'

import ApplyGiftCodeModel from './model'
// import CheckGiftCodeModel from './models/model'
import ApplyGiftCodeModal from './partials/view'

class ApplyGiftCode extends View {
  get el() {
    return '#content-section'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'input #EnterPromoCode': 'validatePromoCode',
      'submit #applyCodeForm': 'checkCode',
    }
  }

  initialize(options) {
    console.log('ApplyGiftCode initialize')
    this.i18n = options.i18n
    this.gifting = this.model.get('gifting')

    // this.checkGiftCodeModel = new CheckGiftCodeModel(this.gifting.attributes)
    this.promoValidateModel = new PromoValidateModel(this.model.attributes)
    this.applyGiftCodeModel = new ApplyGiftCodeModel()

    this.popup = new ApplyGiftCodeModal({ model: this.model, i18n: this.i18n })

    this.listenTo(this.model, 'applyGiftCode:undelegateEvents', () => {
      console.log('ApplyGiftCode garbageCollect')
      this.remove()
      // debugger
    })

    this.listenTo(this.promoValidateModel, 'change:promoCodeSuccess', (model, value) => {
      console.log(model, value)
      // debugger
      if (value) {
        // debugger
        const promoCode = model.get('promoCode')
        const sessionID = this.model.get('Session').SessionID
        this.applyGiftCodeModel.applyCode(promoCode, sessionID)
      } else {
        this.removeLoader()
        // const errorRedeemGiftExpired = this.i18n.t('REDEEM-GIFT-EXPIRED')
        const promoCode = this.$('#EnterPromoCode').val()
        const { message } = model.get('flashMessage')
        const errorMessage = message.toLowerCase().includes('expired')
          ? this.i18n.t('REDEEM-GIFT-EXPIRED')
          : message
        const supportLink = $('<a>').attr({
          class: 'divMsgError',
          href: `mailto:support@acorn.tv?Subject=Promo%20Code%20Issue%20with%20code:%20${promoCode}`,
          target: '_top',
        })
          .html(errorMessage)

        this.popup.render()
        this.popup.setModelBody(supportLink)
      }
      this.promoValidateModel.unset('promoCodeSuccess', { silent: true })
    })

    this.listenTo(this.applyGiftCodeModel, 'invalid', (model, value) => {
      console.log(model, value)
      this.removeLoader()
      this.popup.render()
      this.popup.setModelBody(this.i18n.t(value))
    })

    this.listenTo(this.applyGiftCodeModel, 'change:applyGiftCodeSuccess', (model, value) => {
      console.log(model, value)
      this.removeLoader()
      debugger
      if (value) {
        const message = `<strong>${this.i18n.t('PROMO-APPLIED')}</strong>`
        this.popup.renderSuccess()
        this.popup.setModelBody(message)
      } else {
        // const errorRedeemGiftNotAvailable = this.i18n.t('REDEEM-GIFT-NOT-AVAILABLE')
        const { message } = model.get('flashMessage')
        const errorMessage = message.toLowerCase().includes('error')
          ? this.i18n.t('ERR-PROCESS-REQUEST')
          : message
        // if (xhr.status == 500) {
        //   errorMessage = errorRedeemGiftNotAvailable
        // } else {
        //   errorMessage = polyglot.t("ERR-PROCESS-REQUEST")
        // }
        this.popup.render()
        this.popup.setModelBody(errorMessage)
      }
      this.applyGiftCodeModel.unset('applyGiftCodeSuccess', { silent: true })
    })

    this.listenTo(this.model, 'applyGiftCode:giftCodeApplied', () => {
      Backbone.history.navigate('membership', { trigger: true })
      this.model.trigger('applyGiftCode:undelegateEvents')
    })

    this.render()
  }

  render() {
    console.log('ApplyGiftCode render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.html(html)

    this.setElement('.gift-code.store.container')

    // this.$applyCodeAlert = this.$('#applyCodeAlert')
    // this.$applyCodeModal = this.$('#applyCodeModal')

    const subscription = (this.model.has('Subscription') && this.model.get('Subscription'))
    if (subscription) {
      const membershipType = (subscription.Annual) ? 'annual' : 'monthly'
      this.model.set({
        currentPlanID: this.model.get(`${membershipType}StripePlan`).PlanID,
      })
    }

    return this
  }

  validatePromoCode(e) {
    e.preventDefault()
    // Reset errors.
    e.target.parentElement.classList.remove('has-error')
    e.target.setCustomValidity('')

    // Check for errors.
    if (e.target.validity.valueMissing) {
      e.target.parentElement.classList.add('has-error')
      e.target.setCustomValidity(this.i18n.t('CHCK-PROMO-CODE'))
    }
    if (e.target.validity.patternMismatch) {
      e.target.parentElement.classList.add('has-error')
      e.target.setCustomValidity(this.i18n.t('ALPHANUMERIC-ONLY-ERROR'))
    }
  }

  validateInput() {
    let isValidated = true
    const promoCodeEl = this.$('#EnterPromoCode')
    if (_.isEmpty(promoCodeEl.val())) {
      promoCodeEl.parent('.form-group').removeClass('has-success').addClass('has-error')
      isValidated = false
    } else {
      promoCodeEl.parent('.form-group').removeClass('has-error')
    }

    return isValidated
  }

  checkCode(e) {
    console.log('ApplyGiftCode', e)
    e.preventDefault()

    this
      .$('input')
      .prop('disabled', true)

    this
      .$('button')
      .prop('disabled', true)

    const promoCodeEl = this.$('#EnterPromoCode')
    if (promoCodeEl[0].checkValidity() && this.validateInput()) {
      const giftCode = this.$('#EnterPromoCode').val()
      this.displayLoader(giftCode)
    }
  }

  displayLoader(giftCode) {
    const loader = `<i class="icon-spinner icon-spin icon-large"></i> ${this.i18n.t('SUBMITTING')}`
    const modal = $('<div>')
      .attr({ id: 'applyCodeAlert' })
      .addClass('alert alert-info')
      .css({ display: 'none' })
      .html(loader)
    // debugger
    this
      .$('button')
      .before(modal)
    // debugger
    $('#applyCodeAlert')
      .slideDown(400, () => {
        // debugger
        // this.checkGiftCodeModel.checkCode(giftCode)
        const data = {
          Code: giftCode,
          Country: this.model.get('stripePlansCountry'),
          CustomerID: (this.model.has('Customer') && this.model.get('Customer').CustomerID) || '',
          PlanID: this.model.get('currentPlanID'),
        }
        console.log(data)
        this.promoValidateModel.submit(data)
      })
  }

  removeLoader() {
    $('#applyCodeAlert')
      .slideUp(400, () => {
        $(this).remove()
      })

    this
      .$('input')
      .prop('disabled', false)

    this
      .$('button')
      .prop('disabled', false)
  }
}

export default ApplyGiftCode
