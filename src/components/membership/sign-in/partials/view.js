import { View } from 'backbone'

// import './stylesheet.scss'
import template from './index.hbs'

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

    this
      .$('#signInForm')
      .after(html)

    this.setElement('#signInModal')
    // debugger
    this.$el
      .on('hidden.bs.modal', () => {
        this.$el.remove()
      })

    this.$el
      .modal()
  }

  setModalBody(message) {
    this
      .$('.modal-body')
      .html(message)
  }
}

export default MembershipSignInModal
