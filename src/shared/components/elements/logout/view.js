import { View } from 'backbone'
import LogoutModel from './model'

class Logout extends View {
  initialize() {
    console.log('Logout initialize')
    this.model = new LogoutModel()
    /* eslint no-unused-vars: 0 */
    this.listenTo(this.model, 'change:isLoggedOut', (model, value, options) => {
      // console.log(model, value, options)
      window.location.assign('/')
    })
  }
}

export default Logout
