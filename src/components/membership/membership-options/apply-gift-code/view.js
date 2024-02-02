import Backbone, { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class MembershipApplyGiftCode extends View {
  get el() {
    return '#membership-info-gift'
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
    // this.listenTo(this.model, 'change:signInSuccess', (model, value, options) => {
    //   console.log(model, value, options)
    //   debugger
    //   if (value) {
    //     this.signedInTemplate()
    //     // giveObj.set("AllowedToCheckout", true);
    //   } else {
    //     // this.$el.find('.form-group').addClass('has-error');
    //     // this.$signInAlert.slideUp();

    //     // this.$signInStatus.html(response.responseJSON.error);
    //     // this.$signInModal.modal();
    //     // giveObj.set("AllowedToCheckout", false);
    //   }
    // })
    // const isLoggedIn = this.model.get('Session').LoggedIn
    const membershipActive = this.model.get('Membership').Status.toUpperCase() === 'ACTIVE'
    // const isRecordedBook = (
    //   this.model.has('Membership')
    //   && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    // )

    if (!membershipActive) {
      this.render()
    }
  }

  render() {
    console.log('MembershipApplyGiftCode render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.append(html)

    return this
  }

  applyGiftCodeTemplate(e) {
    e.preventDefault()
    const isLoggedIn = this.model.get('Session').LoggedIn
    if (isLoggedIn) {
      // window.location.hash = '#applyGiftCode'
      Backbone.history.navigate('applyGiftCode', { trigger: true })
      this.model.trigger('give:undelegateEvents')
    } else {
      window.location.href = `${this.model.get('signupEnv')}/createaccount.jsp`
    }
  }

  signedInTemplate() {
    this.MembershipSignedIn = new this.MembershipSignedIn({ model: this.model, i18n: this.i18n })
  }
}

export default MembershipApplyGiftCode
