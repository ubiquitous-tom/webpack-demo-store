import { View } from 'backbone'
// import _ from 'underscore'

import Workspace from '../routers/router'

class ATVView extends View {
  initialize(options) {
    console.log('ATVView initialize')
    console.log(this, options)
    this.model = options.model
    this.i18n = options.i18n
    this.router = new Workspace({ model: this.model, i18n: this.i18n })
  }

  render() {
    console.log('ATVView render')
    // debugger
    return this
  }
}

export default ATVView
