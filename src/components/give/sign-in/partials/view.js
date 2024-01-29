import { View } from 'backbone'

// import './stylesheet.scss'
import template from './modal.hbs'

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

export default GivesignInModal
