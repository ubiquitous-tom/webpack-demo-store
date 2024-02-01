import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import template from './index.hbs'

import ApplyGiftCodeModel from './model'
import CheckGiftCodeModel from './models/model'

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

    this.checkGiftCodeModel = new CheckGiftCodeModel()
    this.applyGiftCodeModel = new ApplyGiftCodeModel()
    this.applyGiftCodeModel.set({
      sessionID: this.model.get('Session').SessionID,
    })

    this.listenTo(this.checkGiftCodeModel, 'change:checkPromoCodeSuccess', (model, value) => {
      console.log(model, value)
      debugger
      if (value) {
        this.applyCode(model.get('promoCode'))
      } else {
        console.log(model, value)
        this.$applyCodeAlert.slideUp()
        const promoCode = model.get('promoCode')
        // const errorRedeemGiftExpired = this.i18n.t('REDEEM-GIFT-EXPIRED')
        const promoCodeErrorText = ''
        const supportLink = $('<a>').attr({
          class: 'divMsgError',
          href: `mailto:support@acorn.tv?Subject=Promo%20Code%20Issue%20with%20code:%20${promoCode}`,
          target: '_top',
        })
          .html(promoCodeErrorText)
        this.$applyCodeStatus.html(supportLink)

        this.$applyCodeModal.modal()
      }
    })

    this.listenTo(this.applyGiftCodeModel, 'change:applyGiftCodeSuccess', (model, value) => {
      console.log(model, value)
      if (value) {
        this.$applyCodeModal.on('hide.bs.modal', _.bind((e) => {
          console.log('change:applyPromoCodeSuccess hide.bs.modal', e)
          this.model.clear({ silent: true })
          this.model.fetch()
          Backbone.trigger('navChange', 'accountStatus')
        }, this))

        this.$applyCodeAlert.slideUp()

        const successApplyCodeInfoMsg = `<strong>${this.i18n.t('PROMOTION-APPLIED')}</strong>`
        this.$applyCodeStatus.html(successApplyCodeInfoMsg)
        this.$applyCodeModal.modal()
      } else {
        this.$applyCodeAlert.slideUp()
        // const errorRedeemGiftNotAvailable = this.i18n.t('REDEEM-GIFT-NOT-AVAILABLE')
        const errorMessage = this.i18n.t('ERR-PROCESS-REQUEST')
        // if (xhr.status == 500) {
        //   errorMessage = errorRedeemGiftNotAvailable
        // } else {
        //   errorMessage = polyglot.t("ERR-PROCESS-REQUEST")
        // }
        this.$applyCodeStatus.html(errorMessage)
        this.$applyCodeModal.modal()
      }
    })

    // this.render()
  }

  render() {
    console.log('ApplyGiftCode render')

    // if not logged in the send to the user to Signup service `/createaccount.jsp`
    if (this.model.has('Session') && !this.model.get('Session').LoggedIn) {
      // debugger
      window.location.href = `${this.model.get('signupEnv')}/createaccount.jsp`
      return this
    }

    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.html(html)

    this.$applyCodeAlert = this.$('#applyCodeAlert')
    this.$applyCodeModal = this.$('#applyCodeModal')

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

  checkCode(e) {
    console.log('ApplyGiftCode', e)
    e.preventDefault()
    const giftCode = this.$('#EnterPromoCode').val()
    this.checkGiftCodeModel.checkCode(giftCode)
  }

  applyCode(giftCode) {
    console.log('ApplyGiftCode')
    const submitBillingInfoMsg = `<i class="icon-spinner icon-spin icon-large"></i> ${this.i18n.t('SUBMITTING')}...`
    this.$applyCodeAlert.html(submitBillingInfoMsg).addClass('alert-info').slideDown()

    // const giftCode = this.$('#EnterPromoCode').val()

    if (!_.isEmpty(giftCode)) {
      this.applyGiftCodeModel.applyCode(giftCode)
    } else {
      this.$applyCodeAlert.slideUp()

      this.$applyCodeStatus.html(this.i18n.t('CODE-INVALID'))
      this.$applyCodeModal.modal()
    }
  }
}

export default ApplyGiftCode
