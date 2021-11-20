import { Model, View } from 'backbone'
import _ from 'underscore'

import './stylesheet.css'
import template from './index.hbs'

class FlashMessage extends View {

  get el() {
    return '#account'
  }

  get template() {
    return template
  }

  initialize(options) {
    console.log('FlashMessage initialize')
    // console.log(options.dispatcher)
    this.dispatcher = options.dispatcher
    this.model = new Model()
    this.model.set({
      message: 'hello',
      type: 'bg-primary',
    })
    this.dispatcher.once('showFlashMessage', this.render, this)
    // console.log(this.model.attributes)
  }

  render(message, type) {
    console.log('FlashMessage render')
    // console.log(message, type)
    this.setInfo(message, type)

    // console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    // console.log(html)
    // console.log(this.$el[0])
    this.$el.before(
      // html
      $(html)
        .delay(10000)
        .slideUp(800, () => {
          $('.flash-message').remove()
        })
    )

    return this
  }

  setInfo(message, type) {
    console.log('FlashMessage setInfo')
    // console.log(message, type)
    this.message = (!_.isEmpty(message)) ? message : this.message
    this.type = (!_.isEmpty(type)) ? type : this.type
    this.model.set({
      'message': this.message,
      'type': this.type
    })
  }
}

export default FlashMessage
