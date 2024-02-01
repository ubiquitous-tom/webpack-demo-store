import { View } from 'backbone'
import template from './index.hbs'

class GiveLegal extends View {
  get el() {
    return '#content-section'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('GiveLegal initialize')

    // this.render()
  }

  render() {
    console.log('GiveLegal render')
    console.log(this.model.attributes)
    const attributes = {
      specialDiscount: this.model.has('DiscountRate'),
    }
    const html = this.template(attributes)
    this
      .$('.give.store.container')
      .append(html)

    return this
  }
}

export default GiveLegal
