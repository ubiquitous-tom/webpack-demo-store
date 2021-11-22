import { Events } from 'backbone'
import _ from 'underscore'

class Dispatcher {

  constructor() {
    console.log('Dispatcher constructor')
    _.extend(this, Events);
    // console.log(this)
  }
}

export default Dispatcher
