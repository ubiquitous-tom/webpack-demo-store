import { View } from 'backbone'

// import './stylesheet.scss'
import template from './index.hbs'

class MembershipSignUpModal extends View {
  get el() {
    return '.membership.store.container'
  }

  get template() {
    return template
  }

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
    this
      .$('#signUpForm')
      .after(html)

    this.setElement('#signInModal')

    this.$el.on('hidden.bs.modal', () => {
      this.$el.remove()
      this.model.trigger('membership:accountAlreadyExist')
    })

    this.$el
      .modal()
  }
}

export default MembershipSignUpModal
