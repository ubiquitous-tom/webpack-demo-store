import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class StoreHomeContent extends View {
  get el() {
    return '#landing'
  }

  get temlate() {
    return template
  }

  initialize() {
    console.log('StoreHomeContent initialize')

    this.render()
  }

  render() {
    console.log('StoreHomeContent render')
    console.log(this.model.attributes)
    const html = this.temlate(this.model.attributes)
    // console.log(this.$el, html)
    this.$el.append(html)

    return this
  }
}

export default StoreHomeContent
