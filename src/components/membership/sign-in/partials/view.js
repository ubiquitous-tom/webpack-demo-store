import { View } from 'backbone'

// import './stylesheet.scss'
import template from './modal.hbs'

class MembershipSignInModal extends View {
  get el() {
    return '.membership.store.container'
  }

  get template() {
    return template
  }

  initialize(options) {
    console.log('MembershipSignInModal initialize')
    this.i18n = options.i18n
  }

  render() {
    const html = this.template()
    this.$el
      .find('#signInForm')
      .after(html)
    this.$el
      .find('#signInModal')
      .modal()
    // debugger
    this.$el
      .find('#signInModal')
      .on('hidden.bs.modal', () => {
        this.$el.find('#signInModal').remove()
      })
  }
}

export default MembershipSignInModal
