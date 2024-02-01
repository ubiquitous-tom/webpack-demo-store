import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class GiveTagline extends View {
  get el() {
    return '#content-section'
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
    const html = this.template()
    this
      .$('.give.store.container')
      .append(html)

    return this
  }
}

export default GiveTagline
