import { View } from 'backbone'
import MParticleModel from './model'

class MParticle extends View {
  initialize(options) {
    if (this.isMParticleLoaded()) {
      console.log('MParticle initialize')
      this.mParticleModel = new MParticleModel({ model: options.model })
    }
  }

  render() {
    console.log('MParticle render')

    return this
  }

  logPageView() {
    if (this.isMParticleLoaded()) {
      const data = {
        page: window.location.toString(),
        page_title: document.title,
        referring_page: document.referrer,
        platform: process.env.MP_PLATFORM,
        network: process.env.MP_NETWORK,
      }
      console.log(data)
      /* eslint-disable no-undef */
      mParticle.logPageView('page_view', data)
    }
  }

  login() {
    if (this.isMParticleLoaded()) {
      const identityRequest = this.mParticleModel.get('userIdentities')
      mParticle.Identity.login(identityRequest)
    }
  }

  logout() {
    if (this.isMParticleLoaded()) {
      const identityCallback = (result) => {
        if (result.getUser()) {
          // IDSync request succeeded, mutate attributes or query for the MPID as needed
          const user = result.getUser()
          console.log(user)
          return
        }
        debugger
        const codes = window.mParticle.Identity.HTTPCodes
        switch (result.httpCode) {
          case codes.noHttpCoverage:
            // retry the IDSync request
            break
          case codes.activeIdentityRequest:
          case 429:
            // inspect your implementation if this occurs frequency
            // otherwise retry the IDSync request
            break
          case codes.validationIssue:
          case 400:
            console.log(result.body)
            // inspect result.body to determine why the request failed
            // this typically means an implementation issue
            break
          default:
            console.log(result.body)
        }
      }

      mParticle.Identity.logout({}, identityCallback)
    }
  }

  isMParticleLoaded() {
    return (process.env.MP_KEY)
  }
}

export default MParticle
