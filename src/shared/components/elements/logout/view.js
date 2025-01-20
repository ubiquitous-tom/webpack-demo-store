import { View } from 'backbone'
import MParticle from 'shared/elements/mparticle'
import LogoutModel from './model'

class Logout extends View {
  initialize(options) {
    console.log('Logout initialize')
    this.mParticle = new MParticle({ model: options.model })
    this.model = new LogoutModel()
    /* eslint no-unused-vars: 0 */
    this.listenTo(this.model, 'change:isLoggedOut', (model, value) => {
      // console.log(model, value, options)
      this.mParticle.logout()
      window.location.assign('/')
    })
  }
}

export default Logout
