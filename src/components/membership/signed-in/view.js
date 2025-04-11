import Backbone, { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'

import Promo from 'shared/elements/promo'

import MembershipActiveTemplate from './templates/membership-active.hbs'
import MembershipNotActiveTemplate from './templates/membership-not-active.hbs'

class MembershipSignedIn extends View {
  get el() {
    return '.membership.store.container'
  }

  get template() {
    const isMembershipActive = (this.model.get('Membership').Status === 'ACTIVE')
    const isRecordedBook = (
      this.model.has('Membership')
      && (this.model.get('Membership').Store === 'RECORDEDBOOKS')
    )
    return (isMembershipActive && !isRecordedBook)
      ? MembershipActiveTemplate
      : MembershipNotActiveTemplate
  }

  get events() {
    return {
      'click #changeToAnnual': 'addAnnualMembership',
      'click #renewMembership': 'addAnnualMembership',
      'click #giveGift': 'giveGift',
    }
  }

  initialize(options) {
    console.log('MembershipSignedIn initialize')
    this.i18n = options.i18n
    this.cart = this.model.get('cart')

    this.promoView = new Promo(this.model.attributes)

    // const isLoggedIn = this.model.get('Session').LoggedIn
    // const isMembershipActive = this.model.get('Membership').Status === 'ACTIVE'
    // const isRecordedBook = (
    //   this.model.has('Membership')
    //   && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    // )

    this.listenTo(this.model, 'membership:undelegateEvents', () => {
      console.log('MembershipSignedIn garbageCollect')
      this.remove()
      // debugger
    })

    // if (isMembershipActive && !isRecordedBook) {

    this.render()
    // }
  }

  render() {
    console.log('MembershipSignedIn render')
    console.log(this.model.attributes)
    const isMembershipActive = (this.model.get('Membership').Status === 'ACTIVE')
    let attributes = {}
    if (isMembershipActive) {
      attributes = {
        yourMembershipType: this.yourMembershipType(),
        yourMembershipExpiredDate: this.yourMembershipExpiredDate(),
        isWebPaymentEdit: this.model.get('Customer').webPaymentEdit,
        upgradeToAnnual: this.upgradeToAnnual(),
        renewMembership: this.renewMembership(),
        isGroupNameAllowedGifting: this.model.get('isGroupNameAllowedGifting'),
      }
    } else {
      attributes = {
        name: !_.isEmpty(this.model.get('Customer').Name)
          ? this.model.get('Customer').Name
          : '',
      }
    }
    const html = this.template(attributes)
    this.$el
      .append(html)

    this.setElement('#signedIn')

    // Remove preset options like `promo code` and `plan`
    // since we already have an `ACTIVE` membership
    if (isMembershipActive) {
      debugger
      this.promoView.removePresetOptions()
    }

    return this
  }

  addAnnualMembership(e) {
    e.preventDefault()
    // Add a year of subscription for an already yearly subscriber
    const monthlyMembership = {
      monthly: {
        amount: this.model.get('monthlyStripePlan').SubscriptionAmount,
        quantity: 0,
        total: this.model.get('monthlyStripePlan').SubscriptionAmount,
      },
    }
    this.cart.set(monthlyMembership)

    const annualMembership = {
      annual: {
        amount: this.model.get('annualStripePlan').SubscriptionAmount,
        quantity: 1,
        total: this.model.get('annualStripePlan').SubscriptionAmount,
      },
    }
    this.cart.set(annualMembership)
    debugger

    const isLoggedIn = this.model.has('Subscription')
    const isStripeEnabled = this.model.get('Customer')?.StripeEnabled
    debugger
    if (isLoggedIn) {
      if (isStripeEnabled) {
        Backbone.history.navigate('reviewPurchase', { trigger: true })
      } else {
        Backbone.history.navigate('editBilling', { trigger: true })
      }
      this.model.trigger('membership:undelegateEvents')
    } else {
      this.model.trigger('membership:checkout')
    }
  }

  giveGift(e) {
    e.preventDefault()
    this.cart.emptyCart(this.model, this)
    Backbone.history.navigate('give', { trigger: true })
    this.model.trigger('membership:undelegateEvents')
  }

  yourMembershipType() {
    const isMonthly = (this.model.get('Membership').Term.toUpperCase() === 'MONTH')
    const isExpirationDate = _.isEmpty(this.model.get('Membership').ExpirationDate)
    if (isMonthly && isExpirationDate) {
      const membershipType = (this.model.get('Membership').Term.toUpperCase() === 'MONTH')
        ? this.i18n.t('MONTHLY')
        : this.i18n.t('ANNUAL')
      return `${this.i18n.t('YOUR-MEMBERSHIP-TYPE')} <strong>${membershipType}</strong>`
    }

    return ''
  }

  yourMembershipExpiredDate() {
    const isMonthly = (this.model.get('Membership').Term.toUpperCase() === 'MONTH')
    const isExpirationDate = _.isEmpty(this.model.get('Membership').ExpirationDate)
    if (isMonthly && !isExpirationDate) {
      return `${this.i18n.t('MEMBERSHIP-SET-EXPIRE')} ${this.model.get('Membership').ExpirationDate}`
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
      const isAnnual = (this.model.get('Membership').Term.toUpperCase() === 'ANNUAL')
      const isExpirationDate = !_.isEmpty(this.model.get('Membership').ExpirationDate)
      if (isAnnual && isExpirationDate) {
        return `<a href="#" id="renewMembership">${this.i18n.t('RENEW-MEMBERSHIP')}</a><br>`
      }
    }

    return ''
  }
}

export default MembershipSignedIn
