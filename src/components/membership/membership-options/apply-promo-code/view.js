import { View } from 'backbone'
// import _ from 'underscore'

import PromoValidateModel from 'core/models/promo-validate'
import Promo from 'shared/elements/promo'

import './stylesheet.scss'
import template from './index.hbs'

// import MembershipApplyPromoCodeModel from './model'

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
    // this.membershipApplyPromoCodeModel = new MembershipApplyPromoCodeModel(
    //   this.gifting.attributes
    // )
    this.promoValidateModel = new PromoValidateModel(this.model.attributes)
    this.promoView = new Promo({ i18n: options.i18n })

    // this.getPresetOptions()
    this.promoView.getPresetOptions()

    this.listenTo(this.model, 'membership:undelegateEvents', () => {
      console.log('MembershipApplyPromoCode garbageCollect')
      this.remove()
      // debugger
    })

    this.listenTo(this.promoValidateModel, 'change:promoCodeSuccess', (model, value) => {
      console.log(model, value)
      console.log(this, this.model.attributes)
      // debugger
      model.unset('promoCodeSuccess', { silent: true })
      let { message } = model.get('flashMessage')
      let type = false
      if (value) {
        const membershipPromo = model.get('promo')
        if (
          membershipPromo.SourceCodeMapping
          && (!membershipPromo.StripeOrg || membershipPromo.StripeOrg === 'ACORN')
        ) {
          type = true
          this.model.set({ membershipPromo }, { context: this })
        } else {
          // message = this.i18n.t('PROMOCODE-ERROR')
          message = '"Gift Code" provided. Please redeem with the Gift Code form'
        }
      }
      // this.updatePromoMessage(message, type)
      this.promoView.updatePromoMessage(this.$('#apply-promo-code'), message, type)
      console.log(this.model.attributes)
    })

    this.listenTo(this.cart, 'change:monthly', (model, value) => {
      console.log(model, value)
      const promo = this.promoView.getPresetOption('promo')
      const plan = this.promoView.getPresetOption('plan')
      // When we have preset options
      if ((plan === 'monthly')) {
        if (promo) {
          // debugger
          this.promoView.setPresetOptions(this.$el, 'promo')
          this.promoView.removePresetOptions()
        } else {
          /* eslint no-lonely-if: 0 */
          if (this.$('#promo-code').val()) {
            // debugger
            const data = {
              Code: this.$('#promo-code').val(),
              Country: this.model.get('stripePlansCountry'),
              CustomerID: (this.model.has('Customer') && this.model.get('Customer').CustomerID) || '',
              PlanID: this.model.get('currentPlanID'),
            }
            // debugger
            console.log(data)
            this.promoValidateModel.submit(data)
          }
        }
      }
    })

    this.listenTo(this.cart, 'change:annual', (model, value) => {
      console.log(model, value)
      const promo = this.promoView.getPresetOption('promo')
      const plan = this.promoView.getPresetOption('plan')
      // When we have preset options
      if ((plan === 'annual')) {
        if (promo) {
          // debugger
          this.promoView.setPresetOptions(this.$el, 'promo')
          this.promoView.removePresetOptions()
        } else {
          /* eslint no-lonely-if: 0 */
          if (this.$('#promo-code').val()) {
            const data = {
              Code: this.$('#promo-code').val(),
              Country: this.model.get('stripePlansCountry'),
              CustomerID: (this.model.has('Customer') && this.model.get('Customer').CustomerID) || '',
              PlanID: this.model.get('currentPlanID'),
            }
            // debugger
            console.log(data)
            this.promoValidateModel.submit(data)
          }
        }
      }
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
      const promo = this.model.get('membershipPromo')
      const promoCode = promo.PromotionCode
      // // const stripePercentOff = promo.StripePercentOff
      // // const message = `${promoCode} applied. Enjoy your ${stripePercentOff}% off!`
      // const message = this.promoValidateModel.promoMessageParser()
      this.$('#promo-code').val(promoCode)
      // // this.updatePromoMessage(message, 'success')
      // this.promoView.updatePromoMessage(this.$('#apply-promo-code'), message, 'success')
      this.$('#apply-promo-code-form button').click()
    }

    this.setPresetOptions()

    return this
  }

  applyPromoCode(e) {
    console.log('MembershipApplyPromoCode applyPromoCode')
    e.preventDefault()
    const data = {
      Code: this.$('#promo-code').val(),
      Country: this.model.get('stripePlansCountry'),
      CustomerID: (this.model.has('Customer') && this.model.get('Customer').CustomerID) || '',
      PlanID: this.model.get('currentPlanID'),
    }
    console.log(data)
    this.promoValidateModel.submit(data)
  }

  clearPromoCode(e) {
    console.log('MembershipApplyPromoCode clearPromoCode')
    e.preventDefault()
    console.log(e)
    // debugger
    this.model.unset('membershipPromo', { context: this })

    // this.clearPromoMessage()
    this.promoView.clearPromoMessage(this.$('#apply-promo-code'))
  }

  // clearPromoMessage() {
  //   console.log('MembershipApplyPromoCode clearPromoMessage')
  //   const container = this.$('#apply-promo-code')
  //   const promoInput = container.find('#promo-code')
  //   const button = container.find('button')
  //   const promoMessage = container.find('.promo-message')
  //   const promoClear = container.find('#promo-clear')

  //   promoInput
  //     .prop('disabled', false)
  //     .val('')

  //   promoClear
  //     .remove()

  //   button
  //     .prop('disabled', false)
  //     .removeAttr('style')
  //     .html(this.i18n.t('APPLY-CODE'))

  //   promoMessage.remove()
  // }

  // updatePromoMessage(message, value) {
  //   console.log('MembershipApplyPromoCode updatePromoMessage')
  //   // debugger
  //   const promoCodeApplied = $('<div>').addClass('col-md-9 promo-message text-center pull-right')
  //   const promoCodeAppliedType = value ? 'success' : 'error'
  //   // const i = $('<i>').addClass('glyphicon glyphicon-ok')

  //   const container = this.$('#apply-promo-code')
  //   const promoInput = container.find('#promo-code')
  //   const button = container.find('button')
  //   const buttonWidth = button.outerWidth()
  //   const xIcon = $('<i>').addClass('fa fa-times-thin fa-2x').attr({ 'aria-hidden': true })
  //   const promoClear = $('<a>').attr('id', 'promo-clear').append(xIcon)
  //   /* eslint comma-dangle: 0 */
  //   // remove old promo message
  //   container
  //     .find('.promo-message')
  //     .remove()
  //   // remove old promo-clear
  //   container
  //     .find('#promo-clear')
  //     .remove()

  //   // disable promo field and button
  //   // if the promo code is good then disable the input
  //   // DWT1-1020
  //   if (value) {
  //     promoInput
  //       .prop('disabled', true)
  //   }
  //   promoInput
  //     .after(promoClear)

  //   // if the promo code is good then disable the button
  //   // DWT1-1020
  //   if (value) {
  //     button
  //       .prop('disabled', true)
  //       .css({
  //         width: buttonWidth,
  //         background: '#afafaf',
  //         color: '#000',
  //         fontWeight: 700,
  //       })
  //       .html(this.i18n.t('APPLIED-PROMO-CODE'))
  //   }

  //   // display new promo message
  //   let promoMessage = message

  //   // if the promo code is bad then show customized message required by the Product owner.
  //   // DWT1-1020
  //   if (!value) {
  //     if (message.includes('expired')) {
  //       promoMessage = this.i18n.t('EXPIRED-PROMO-CODE-2024')
  //     }

  //     if (message.includes('not exist')) {
  //       promoMessage = this.i18n.t('PROMOCODE-ERROR')
  //     }
  //   }

  //   container
  //     .find('.form-group')
  //     .append(
  //       promoCodeApplied
  //         .addClass(promoCodeAppliedType)
  //         // .append(i)
  //         .append(promoMessage)
  //     )
  // }

  // getPresetOptions() {
  //   console.log(window.location)
  //   let queryString = ''
  //   const { hash, search } = window.location
  //   console.log(hash, search)
  //   if (search) {
  //     queryString = search
  //     const urlParamsSearch = new URLSearchParams(queryString)

  //     console.log(urlParamsSearch.has('promocode'))
  //     console.log(urlParamsSearch.get('promocode'))
  //     if (urlParamsSearch.has('promocode')) {
  //       this.promocode = urlParamsSearch.get('promocode')
  //     }

  //     console.log(urlParamsSearch.has('promodisplay'))
  //     console.log(urlParamsSearch.get('promodisplay'))
  //     if (urlParamsSearch.has('promodisplay')) {
  //       this.promocode = urlParamsSearch.get('promodisplay')
  //     }
  //   }
  // }

  setPresetOptions() {
    console.log('MembershipApplyPromoCode setPresetOptions')
    if (this.promoView.getPresetOption('plan') === false) {
      this.promoView.setPresetOptions(this.$el, 'promo')
    }
  }
}

export default MembershipApplyPromoCode
