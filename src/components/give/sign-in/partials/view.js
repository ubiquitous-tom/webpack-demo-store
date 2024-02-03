import { View } from 'backbone'

// import './stylesheet.scss'
import template from './index.hbs'

class GivesignInModal extends View {
  get el() {
    return '.give.store.container'
  }

  get template() {
    return template
  }

  initialize(options) {
    console.log('GivesignInModal initialize')
    this.i18n = options.i18n
  }

  render() {
    const html = this.template()

    this.$el
      .find('.sign-in')
      .after(html)

    this.setElement('#signInModal')

    this.$el
      .on('hidden.bs.modal', () => {
        this.$el.find('#signInModal').remove()
      })
    // debugger
    this.$el
      .modal()
  }

  setModalBody(message) {
    this
      .$('.modal-body #SignInStatus')
      .html(message)
  }
}

export default GivesignInModal
