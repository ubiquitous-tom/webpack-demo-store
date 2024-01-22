import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
// import template from './index.hbs'
import MembershipActiveTemplate from './templates/membership-active.hbs'
import MembershipNotActiveTemplate from './templates/membership-not-active.hbs'

class MembershipSignedIn extends View {
  get el() {
    return '.give.store.container'
  }

  get template() {
    const isMembershipActive = this.model.get('Membership').Status === 'ACTIVE'
    const isRecordedBook = (
      this.model.has('Membership')
      && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    )
    return (isMembershipActive && !isRecordedBook)
      ? MembershipActiveTemplate
      : MembershipNotActiveTemplate
  }

  initialize(options) {
    console.log('MembershipSignedIn initialize')
    this.i18n = options.i18n

    // const isLoggedIn = this.model.get('Session').LoggedIn
    // const isMembershipActive = this.model.get('Membership').Status === 'ACTIVE'
    // const isRecordedBook = (
    //   this.model.has('Membership')
    //   && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    // )

    const isGroupNameAllowedGifting = true // this.model.get('isGroupNameAllowedGifting')

    // if (isMembershipActive && !isRecordedBook) {
    this.model.set({
      yourMembershipType: this.yourMembershipType(),
      upgradeToAnnual: this.upgradeToAnnual(),
      renewMembership: this.renewMembership(),
      isGroupNameAllowedGifting,
    })

    this.render()
    // }
  }

  render() {
    console.log('MembershipSignedIn render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.append(html)

    return this
  }

  yourMembershipType() {
    const isMonthly = this.model.get('Membership').Term.toUpperCase() === 'MONTH'
    const isExpirationDate = !_.isEmpty(this.model.get('Membership').ExpirationDate)
    if (isMonthly && !isExpirationDate) {
      const membershipType = (this.model.get('Membership').Term.toUpperCase() === 'MONTH')
        ? this.i18n.t('MONTHLY')
        : this.i18n.t('ANNUAL')
      return `${this.i18n.t('YOUR-MEMBERSHIP-TYPE')} <strong>${membershipType}</strong>`
    }

    return ''
  }

  yourMembershipExpiredDate() {
    if (!_.isEmpty(this.model.get('Membership').ExpirationDate)) {
      return `${this.i18n.t('MEMBERSHIP-SET-EXPIRE')} this.model.get('Membership').ExpirationDate`
    }

    return ''
  }

  upgradeToAnnual() {
    if (this.model.get('Customer').webPaymentEdit) {
      if (['MONTH', 'TRIAL'].includes(this.model.get('Membership').Term.toUpperCase())) {
        return `<a href="#" id="changeToAnnual">${this.i18n.t('CHANGE-TO-ANNUAL')}</a><br>`
      }
    }

    return ''
  }

  renewMembership() {
    if (this.model.get('Customer').webPaymentEdit) {
      const isAnnual = this.model.get('Membership').Term.toUpperCase() === 'ANNUAL'
      const isExpirationDate = !_.isEmpty(this.model.get('Membership').ExpirationDate)
      if (isAnnual && isExpirationDate) {
        return `<a href="#" id="renewMembership">${this.i18n.t('RENEW-MEMBERSHIP')}</a><br>`
      }
    }

    return ''
  }
}

export default MembershipSignedIn
