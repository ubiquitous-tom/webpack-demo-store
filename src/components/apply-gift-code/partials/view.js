import { View } from 'backbone'

import template from './index.hbs'

class ApplyGiftCodeModal extends View {
  get el() {
    return '#content-section'
  }

  get template() {
    return template
  }

  initialize(options) {
    console.log('ApplyGiftCodeModal initialize')
    this.i18n = options.i18n
  }

  render() {
    console.log('ApplyGiftCodeModal render')
    const html = this.template()

    this
      .$('#applyCodeForm')
      .after(html)

    this.setElement('#applyCodeModal')

    this.$el
      .on('hidden.bs.modal', () => {
        this.$el.remove()
      })

    this.$el
      .modal()

    return this
  }

  renderSuccess() {
    console.log('ApplyGiftCodeModal renderSuccess')
    const html = this.template()

    this
      .$('#applyCodeForm')
      .after(html)

    this.setElement('#applyCodeModal')

    this.$el
      .on('hidden.bs.modal', () => {
        this.$el.remove()
        this.model.trigger('applyGiftCode:giftCodeApplied')
      })

    this.$el
      .modal()

    return this
  }

  setModelBody(message) {
    this
      .$('.modal-body #applyCodeStatus')
      .html(message)
  }
}

export default ApplyGiftCodeModal
