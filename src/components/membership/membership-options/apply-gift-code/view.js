import Backbone, { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class MembershipApplyGiftCode extends View {
  get el() {
    return '#membership-options'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click #apply-gift-code button': 'applyGiftCodeTemplate',
    }
  }

  initialize() {
    console.log('MembershipApplyGiftCode initialize')

    this.listenTo(this.model, 'membership:undelegateEvents', () => {
      console.log('MembershipApplyGiftCode garbageCollect')
      this.remove()
      // debugger
    })

    // const isRecordedBook = (
    //   this.model.has('Membership')
    //   && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    // )
    const membershipActive = this.model.get('Membership').Status.toUpperCase() === 'ACTIVE'
    if (!membershipActive) {
      this.render()
    }
  }

  render() {
    console.log('MembershipApplyGiftCode render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.append(html)

    this.setElement('#membership-info-gift')

    return this
  }

  applyGiftCodeTemplate(e) {
    e.preventDefault()
    const isSubscribed = this.model.has('Subscription') && this.model.get('Subscription').Status !== 'NONE'
    if (isSubscribed) {
      Backbone.history.navigate('applyGiftCode', { trigger: true })
      this.model.trigger('membership:undelegateEvents')
    } else {
      window.location.href = `${this.model.get('signupEnv')}/createaccount.jsp`
    }
  }

  signedInTemplate() {
    this.MembershipSignedIn = new this.MembershipSignedIn({ model: this.model, i18n: this.i18n })
  }
}

export default MembershipApplyGiftCode
