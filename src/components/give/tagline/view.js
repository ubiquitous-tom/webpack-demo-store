import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class GiveTagline extends View {
  get el() {
    return '.give.store.container'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('GiveTagline initialize')

    this.render()
  }

  render() {
    console.log('GiveTagline render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.append(html)

    return this
  }
}

export default GiveTagline
