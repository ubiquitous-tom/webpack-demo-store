import { View } from 'backbone'
import _ from 'underscore'

import template from './temp.html'
import ApplyPromoCodeModel from './model'
import FlashMessage from '../shared/elements/flash-message/view'

class ApplyPromoCode extends View {

  get el() {
    return 'section'
  }

  get template() {
    return _.template(template)
  }

  get events() {
    return {
      'input #EnterPromoCode': 'validatePromoCode',
      // 'input #EnterPromoCode': 'toUpperCase',
      'submit #applyCodeForm': 'applyCode'
    }
  }

  initialize(options) {
    console.log('ApplyPromoCode initialize')
    this.sessionID = options.model.attributes.Session.SessionID

    this.flashMessage = new FlashMessage()
    this.model = new ApplyPromoCodeModel()
    this.render()

    this.listenTo(this.model, 'change:applyPromoCodeSuccess', (model, value, options) => {
      console.log(model, value, options)
      debugger
      this.flashMessage.onFlashMessageShow(this.model.get('message'), this.model.get('type'))
    })
  }

  render() {
    console.log('ApplyPromoCode render')
    this.$el.html(this.template())

    return this
  }

  validatePromoCode(e) {
    console.log('ApplyPromoCode validatePromoCode')
    this.toUpperCase(e)

    // Reset errors.
    e.target.parentElement.classList.remove('has-error')
    e.target.setCustomValidity('')

    // Check for errors.
    if (e.target.validity.valueMissing) {
      e.target.parentElement.classList.add('has-error')
      // e.target.setCustomValidity(polyglot.t('CHCK-PROMO-CODE'))
      e.target.setCustomValidity('Please make sure there are no illegal characters (including spaces) in the promo code.')
    }
    if (e.target.validity.patternMismatch) {
      e.target.parentElement.classList.add('has-error')
      // e.target.setCustomValidity(polyglot.t('ALPHANUMERIC-ONLY-ERROR'))
      e.target.setCustomValidity('Only Alphanumeric characters. Space is not allowed.')
    }
  }

  toUpperCase(e) {
    // console.log(e)
    let input = e.target.value.toUpperCase()
    // console.log(input)
    // console.log(this.$el.find(e.currentTarget)[0])
    this.$el.find(e.currentTarget).val(input)
  }

  applyCode(e) {
    e.preventDefault()
    console.log('ApplyPromoCode applyCode')
    const code = e.target[0].value
    // const code = this.$el.find('#EnterPromoCode').val()
    this.model.applyCode(code, this.sessionID)
  }
}

export default ApplyPromoCode
