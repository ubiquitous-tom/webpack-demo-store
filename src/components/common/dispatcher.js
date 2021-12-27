import { Events } from 'backbone'
import _ from 'underscore'

class Dispatcher {
  constructor() {
    console.log('Dispatcher constructor')
    _.extend(this, Events)
  }

  testAsyncMethod(data) {
    this.trigger('tomtom', data)
  }

  onFlashMessage(eventType, message, messageType) {
    this.trigger(`flashMessage:${eventType}`, message, messageType)
  }
}

export default Dispatcher
