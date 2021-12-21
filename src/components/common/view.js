import { View } from 'backbone'
// import _ from 'underscore'

class ATVView extends View {
  initialize(options) {
    console.log('ATVView initialize')
    console.log(this, options)
    this.model = options.model
    this.i18n = options.i18n
  }

  render() {
    console.log('ATVView render')
    // debugger
    return this
  }
}

export default ATVView
