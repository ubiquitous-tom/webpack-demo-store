import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class MembershipGiveDetails extends View {
  get el() {
    return '.give.store.container'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('MembershipGiveDetails initialize')
    // const isLoggedIn = this.model.get('Session').LoggedIn
    const isRecordedBook = (
      this.model.has('Membership')
      && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    )

    console.log(['EXPIRED', 'CANCELED'].includes(this.model.get('Membership').Status.toUpperCase()))

    const isExpiredCancelledStatus = (this.model.has('Membership') && ['EXPIRED', 'CANCELED'].includes(this.model.get('Membership').Status.toUpperCase()))
    this.model.set({
      isRecordedBook,
      isExpiredCancelledStatus,
    })

    this.render()
  }

  render() {
    console.log('MembershipGiveDetails render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.append(html)

    return this
  }
}

export default MembershipGiveDetails
