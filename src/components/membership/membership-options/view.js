import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

import MembershipApplyGiftCode from './apply-gift-code'
import MembershipApplyPromoCode from './apply-promo-code'
import MembershipSelections from './membership-selections'
import MembershipGiftOptions from './gift-options'
import MembershipCheckout from './checkout'

class MembershipOptions extends View {
  get el() {
    return '.give.store.container'
  }

  get template() {
    return template
  }

  initialize(options) {
    console.log('MembershipOptions initialize')

    this.i18n = options.i18n
    // const isLoggedIn = this.model.get('Session').LoggedIn
    // const isRecordedBook = (
    //   this.model.has('Membership')
    //   && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    // )
    // const isMembershipActive = (
    //   this.model.has('Membership') && this.model.get('Membership').Status === 'ACTIVE'
    // )

    // if (isLoggedIn && !isMembershipActive) {
    this.render()
    // }
  }

  render() {
    console.log('MembershipOptions render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.append(html)

    if (!this.model.has('Membership') || this.model.get('Membership').Status !== 'ACTIVE') {
      this.membershipApplyGiftCode = new MembershipApplyGiftCode({
        model: this.model,
        i18n: this.i18n,
      })
      this.membershipApplyPromoCode = new MembershipApplyPromoCode({
        model: this.model,
        i18n: this.i18n,
      })

      this.membershipSelections = new MembershipSelections({
        model: this.model,
        i18n: this.i18n,
      })

      this.membershipGiftOptions = new MembershipGiftOptions({
        model: this.model,
        i18n: this.i18n,
      })

      this.membershipCheckout = new MembershipCheckout({
        model: this.model,
        i18n: this.i18n,
      })
    }

    return this
  }
}

export default MembershipOptions
