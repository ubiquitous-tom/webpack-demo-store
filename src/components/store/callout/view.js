import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class StoreCallout extends View {
  get el() {
    return '#landing'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('StoreCallout initialize')

    this.render()
  }

  render() {
    console.log('StoreCallout render')
    console.log(this.model.attributes)
    const html = this.template()
    this.$el.append(html)

    return this
  }
}

export default StoreCallout
