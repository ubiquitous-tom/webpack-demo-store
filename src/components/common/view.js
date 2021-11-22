import { View } from 'backbone'
import _ from 'underscore'
import Dispatcher from './dispatcher'

class ATVView extends View {

  initialize(options) {
    console.log('ATVView initialize')
    // this.dispatcher = options.dispatcher
    this.dispatcher = new Dispatcher()
    // console.log(this)
  }

  getDispatcher() {
    return this.dispatcher
  }
}

export default ATVView
