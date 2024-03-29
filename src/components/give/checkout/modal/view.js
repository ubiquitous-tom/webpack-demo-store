import { View } from 'backbone'

// import './stylesheet.scss'
import template from './index.hbs'

class GiveCheckoutModal extends View {
  get el() {
    return '.give.store.container'
  }

  get template() {
    return template
  }

  initialize(options) {
    console.log('GiveCheckoutModal initialize')
    this.i18n = options.i18n
  }

  render() {
    console.log(this.model.attributes)
    const html = this.template()
    this.$el.append(html)

    this.setElement('#selectGiftModal')

    this.$el.on('hidden.bs.modal', () => {
      this.$el.remove()
    })

    this.$el
      .modal()

    return this
  }
}

export default GiveCheckoutModal
