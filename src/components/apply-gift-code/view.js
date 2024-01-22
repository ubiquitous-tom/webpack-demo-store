import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class ApplyGiftCode extends View {
  get el() {
    return '#content-section'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click button': 'submit',
    }
  }

  initialize() {
    console.log('ApplyGiftCode initialize')
  }

  render() {
    console.log('ApplyGiftCode render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.html(html)

    return this
  }

  submit(e) {
    console.log('ApplyGiftCode submit')
    e.preventDefault()
  }
}

export default ApplyGiftCode
