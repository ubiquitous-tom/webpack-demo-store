import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class MembershipGiveDetails extends View {
  get el() {
    return '.membership.store.container'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('MembershipGiveDetails initialize')
    // const isLoggedIn = this.model.get('Session').LoggedIn

    console.log(['EXPIRED', 'CANCELED'].includes(this.model.get('Membership').Status.toUpperCase()))

    this.render()
  }

  render() {
    console.log('MembershipGiveDetails render')
    console.log(this.model.attributes)
    const isRecordedBook = (
      this.model.has('Membership')
      && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    )
    const isExpiredCancelledStatus = (this.model.has('Membership') && ['EXPIRED', 'CANCELED'].includes(this.model.get('Membership').Status.toUpperCase()))
    const attributes = {
      isRecordedBook,
      isExpiredCancelledStatus,
    }
    const html = this.template(attributes)
    this.$el.append(html)

    this.setElement('.giveDetails')

    return this
  }
}

export default MembershipGiveDetails
