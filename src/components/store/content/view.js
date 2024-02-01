import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class StoreHomeContent extends View {
  get el() {
    return '#content-section'
  }

  get temlate() {
    return template
  }

  initialize() {
    console.log('StoreHomeContent initialize')

    // this.render()
  }

  render() {
    console.log('StoreHomeContent render')
    console.log(this.model.attributes)
    const attributes = {
      signupEnv: this.model.get('signuEnv'),
    }
    const html = this.temlate(attributes)
    console.log(this.$el, html)
    this
      .$('#landing')
      .append(html)

    return this
  }
}

export default StoreHomeContent
