import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class Thankyou extends View {
  get el() {
    return '#contentSecion'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('Thankyou initialize')
  }

  render() {
    console.log('Thankyou render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.html(html)

    return this
  }
}

export default Thankyou
