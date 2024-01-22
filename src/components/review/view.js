import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class Review extends View {
  get el() {
    return '#content-secion'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('Review initialize')
  }

  render() {
    console.log('Review render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.html(html)

    return this
  }
}

export default Review
