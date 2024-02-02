import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class MembershipLegal extends View {
  get el() {
    return '.legal'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('MembershipLegal initialize')
    const isLoggedIn = this.model.get('Session').LoggedIn
    // const isRecordedBook = (
    //   this.model.has('Membership')
    //   && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    // )
    const isAnnualMembership = (
      this.model.has('Membership') && this.model.get('Membership').Status === 'ACTIVE'
      && this.model.get('Membership').Term.toUpperCase() === 'ANNUAL'
    )
    const isWebPaymentEdit = (
      this.model.has('Customer')
      && this.model.get('Customer').webPaymentEdit === true
    )

    // TODO: rewrite this weird original logic.
    if (!isLoggedIn) {
      this.render()
    } else if (!isAnnualMembership || isWebPaymentEdit) {
      this.render()
    }
  }

  render() {
    console.log('MembershipLegal render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.append(html)

    return this
  }
}

export default MembershipLegal
