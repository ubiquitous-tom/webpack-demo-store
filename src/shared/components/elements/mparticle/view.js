import { View } from 'backbone'
import docCookies from 'doc-cookies'
import MParticleModel from './model'

class MParticle extends View {
  initialize(options) {
    if (this.isMParticleLoaded()) {
      console.log('MParticle initialize')
      this.mParticleModel = new MParticleModel({ model: options.model })
      this.render()

      this.listenTo(this.model, 'router:executeRoute', (model) => {
        console.log(model)
        // Once the `/initializeApp` API is fully logged in then log into mParticle.
        if (model.get('Session') && model.get('Session')?.LoggedIn) {
          const userData = {
            email: model.get('Customer')?.Email || '',
            customerID: model.get('Customer')?.CustomerID || '',
          }
          if (!this.isMParticleLoggedIn()) {
            debugger
            this.login(model.get('Session').LoggedIn, userData)
          }
        }
      })
    }
  }

  render() {
    console.log('MParticle render')

    this.initializeConfig()

    return this
  }

  initializeConfig() {
    this.requiredAttribures = {
      ga_uid: docCookies.getItem('ATVSessionCookie') || '',
      auth_state: this.model.get('Session')?.LoggedIn ? 'ob-sub-acorn' : 'unauth',
      // page_type: 'home', // this will be coming from `current_page_data`
      // last_url: document.referrer,
      url: document.location.pathname,
      full_url: document.location.href,
      platform: 'web',
      service: 'acorn',
      network: 'acorn',
    }

    if (this.model.get('Session')?.LoggedIn) {
      /* eslint-disable no-undef */
      const currentUser = mParticle.Identity.getCurrentUser()
      console.log(currentUser)
      if (currentUser) {
        currentUser.setUserAttribute('last_url', document.referrer)
      }
    }
  }

  logPageView(pageName) {
    if (this.isMParticleLoaded()) {
      this.requiredAttribures.page_type = pageName
      console.log('MParticle logPageView', this.requiredAttribures)
      /* eslint-disable no-undef */
      mParticle.logPageView('page_view', this.requiredAttribures)
    }
  }

  logClickEvent(e, customEvent, additionalData) {
    if (this.isMParticleLoaded()) {
      let clickedEl = jQuery(e.target)
      console.log('clicked element', clickedEl)

      const attrItemName = clickedEl.text().trim()
      const elTagName = e.target.tagName.toLowerCase()
      console.log(elTagName)

      let attrCat = 'button'
      let attrAction = 'none'
      let attrLabel = ''
      let attrActionURL = 'none'
      if (elTagName !== 'button' && clickedEl.closest('a').length) {
        clickedEl = clickedEl.closest('a')
        attrCat = 'text link'

        const elTarget = clickedEl.attr('target') || ''
        const elHref = clickedEl.attr('href')

        if (elTarget === '' || elTarget === '_self') {
          attrLabel = 'internal'
          attrAction = 'clickthrough'
          attrActionURL = elHref
        } else if (elTarget === '_blank') {
          attrLabel = 'external'
          attrAction = 'clickthrough'
          attrActionURL = elHref
        } else {
          attrLabel = 'contextual'
        }
      }

      const data = {
        category: attrCat,
        action: attrAction,
        label: attrLabel,
        clickthrough_url: attrActionURL,
        item_name: attrItemName,
        element_name: (attrCat === 'button') ? 'button' : '',
      }
      const attributes = { ...this.requiredAttribures, ...data }
      mParticle.logEvent('click_event', mParticle.EventType.Other, attributes)

      if (customEvent) {
        const customEventAttributes = { ...this.requiredAttribures, ...additionalData }
        mParticle.logEvent(customEvent, mParticle.EventType.Other, customEventAttributes)
      }
    }
  }

  login(isLoggedIn, data) {
    if (this.isMParticleLoaded()) {
      if (isLoggedIn) {
        console.log(this.model)
        debugger
        const identityRequest = {
          userIdentities: {
            email: data.email,
            customerid: data.customerID,
          },
        }
        mParticle.Identity.login(identityRequest, this.mParticleModel.identityCallbackLogin)
      } else {
        mParticle.logError('Login failed')
      }
    }
  }

  identityCallbackLogin(result) {
    if (result.getUser()) {
      const user = result.getUser()
      mParticle.logEvent('account_sign_in', mParticle.EventType.Other, this.requiredAttribures)
      this.mParticleModel.identityCallback(result)
      console.log(user)
      return
    }

    this.mParticleModel.callbackErrorCode(result)
  }

  logout(isLoggedOut) {
    if (this.isMParticleLoaded()) {
      if (isLoggedOut) {
        const logoutAttributes = {
          ...this.requiredAttribures,
          category: 'store_page',
          action: 'active',
        }
        mParticle.logEvent('account_sign_out', mParticle.EventType.Other, logoutAttributes)
        mParticle.Identity.logout({}, this.mParticleModel.identityCallbackLogout)
      } else {
        mParticle.logError('Logout failed')
      }
    }
  }

  identityCallbackLogout(result) {
    if (result.getUser()) {
      // IDSync request succeeded, mutate attributes or query for the MPID as needed
      const logoutAttributes = {
        ...this.requiredAttribures,
        category: 'store_page',
        action: 'active',
      }
      mParticle.logEvent('account_sign_out', mParticle.EventType.Other, logoutAttributes)

      const user = result.getUser()
      console.log(user)
      return
    }

    this.mParticleModel.callbackErrorCode(result)
  }

  isMParticleLoggedIn() {
    const currentUser = mParticle.Identity.getCurrentUser()
    // debugger
    return (currentUser && currentUser.isLoggedIn()) ? currentUser.isLoggedIn() : false
  }

  isMParticleLoaded() {
    return (process.env.MP_KEY)
  }
}

export default MParticle
