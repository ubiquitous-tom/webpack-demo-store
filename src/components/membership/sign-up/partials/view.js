import { View } from 'backbone'

// import './stylesheet.scss'
import template from './modal.hbs'

class MembershipSignUpModal extends View {
  get el() {
    return '.membership.store.container'
  }

  get template() {
    return template
  }

  // get events() {
  //   return {
  //     'click #signInModal': 'remove',
  //   }
  // }

  initialize(options) {
    console.log('MembershipSignUpModal initialize')
    this.i18n = options.i18n
  }

  render() {
    console.log(this.model.attributes)
    const attributes = {
      message: this.i18n.t('ACCOUNT-EXISTS'),
    }
    const html = this.template(attributes)
    this.$el.find('#signUpForm').after(html)
    this.$el.find('#signInModal').modal()

    // this.$el
    //   .find('#SignInStatus')
    //   .html(this.i18n.t('ACCOUNT-EXISTS'))

    this.$el.find('#signInModal').on('hidden.bs.modal', () => {
      this.$el.find('#signInModal').remove()
      this.model.trigger('membership:accountAlreadyExist')
    })

    // this.$el
    //   .find('#signInModal')
    //   .modal()
  }

  remove() {
    this.$el.find('#signInModal').remove()
  }
}

export default MembershipSignUpModal
