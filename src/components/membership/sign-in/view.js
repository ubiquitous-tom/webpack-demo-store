import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'
import modalTemplate from './partials/modal.hbs'

import MembershipSignInModel from './model'

class MembershipSignIn extends View {
  get el() {
    return '.give.store.container'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click #backToSignup': 'signUpTemplate',
      'submit form': 'signIn',
    }
  }

  initialize(options) {
    console.log('MembershipSignIn initialize')
    this.i18n = options.i18n

    this.membershipSignInModel = new MembershipSignInModel()

    this.listenTo(this.membershipSignInModel, 'change:signInSuccess', (model, value) => {
      console.log(model, value)
      // debugger
      if (value) {
        window.location.reload()
      } else {
        this.$el.find('#signInEmail').parent('.form-group').addClass('has-error')
        this.$el.find('#password').parent('.form-group').addClass('has-error')
        // this.$signInAlert.slideUp();
        this.$el.find('.alert').slideUp()

        this.$el.append(this.modalTemplate())
        this.$el.find('#signInStatus').html(model.get('message'))
        this.$el.find('#signInModal').modal()
        // this.$signInStatus.html(response.responseJSON.error);
        // this.$signInModal.modal();
        // giveObj.set("AllowedToCheckout", false);
      }
    })

    // const isLoggedIn = this.model.get('Session').LoggedIn
    // const isRecordedBook = (
    //   this.model.has('Membership')
    //   && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    // )

    // const isGroupNameAllowedGifting = true // this.model.get('isGroupNameAllowedGifting')

    // this.model.set({
    //   isMembershipActive: this.isMembershipActive(),
    //   yourMembershipType: this.yourMembershipType(),
    //   upgradeToAnnual: this.upgradeToAnnual(),
    //   renewMembership: this.renewMembership(),
    //   isGroupNameAllowedGifting,
    // })

    // if (!isLoggedIn) {
    //   this.render()
    // }
  }

  render() {
    console.log('MembershipSignIn render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    if (this.$el.find('#signUpForm').length) {
      this.$el.find('#signUpForm').replaceWith(html)
    } else {
      this.$el.append(html)
    }

    return this
  }

  signUpTemplate(e) {
    e.preventDefault()
    this.model.get('membershipSignUp').render()
  }

  signIn(e) {
    console.log('MembershipSignIn signIn')
    e.preventDefault()
    const data = {
      email: this.$el.find('#signInEmail').val(),
      password: this.$el.find('#password').val(),
    }
    this.membershipSignInModel.signIn(data)
  }

  // signedInTemplate() {
  //   this.MembershipSignedIn = new this.MembershipSignedIn({ model: this.model, i18n: this.i18n })
  // }

  modalTemplate() {
    return modalTemplate
  }

  showAlert() {
    const containerAlert = $('<div>').addClass('alert hidden')
    const signInMsg = `<i class="icon-spinner icon-spin icon-large"></i>' ${this.i18n.t('SIGNING-IN')}`

    containerAlert.html(signInMsg).addClass('alert-info').slideDown()
  }
}

export default MembershipSignIn
