import { View } from 'backbone'

import template from './index.hbs'

class Popup extends View {
  get el() {
    return '#content-section'
  }

  get template() {
    return template
  }

  initialize(options) {
    console.log('Popup initialize')
    console.log(options)
    // this.i18n = (options && options.i18n) ?? options.i18n
    // this.currentEl = (options && options.el) ?? options.el
  }

  render() {
    console.log('Popup render')
    const html = this.template()
    this.$el
      .append(html)

    this.setElement('#popup')

    this.$el
      .modal()
    // debugger
    this.$el
      .on('hidden.bs.modal', () => {
        // this.$el.remove()
        this.model.trigger('poup:onClose')
      })

    return this
  }

  setHeaderContent(message) {
    this
      .$('.modal-header #header-content')
      .html(message)
  }

  setBodyContent(message) {
    this
      .$('.modal-body #body-content')
      .html(message)
  }
}

export default Popup
