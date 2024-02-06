import { Model } from 'backbone'
import _ from 'underscore'

import { LocalStorage } from 'backbone.localstorage'
import { getLocalStorage } from 'backbone.localstorage/src/utils'

import docCookies from 'doc-cookies'

import StripePlans from 'core/models/stripe-plans'
import Gifting from 'core/models/gifting'
import ShoppingCart from 'core/models/cart'

class InitializeApp extends Model {
  get defaults() {
    return {
      appVersion: 'ATV2.0.0',
      localStorageID: 'atv-initializeapp',
    }
  }

  get url() {
    console.log('InitializeApp url')
    return `/initializeapp?AppVersion=${this.get('appVersion')}`
  }

  initialize() {
    console.log('InitializeApp initialize')
    console.log(this)
    this.localStorage = new LocalStorage(this.get('localStorageID'))
    this.stripePlans = new StripePlans()
    this.shoppingCart = new ShoppingCart()
    this.gifting = new Gifting()

    this.stripePlans.on('change:stripePlans', (model, value) => {
      console.log(model, value)
      // debugger
      this.set({
        stripePlans: value,
        stripePlansCountry: model.get('stripePlansCountry'),
        stripePlansLang: model.get('stripePlansLang'),
      })
      this.setAllowedGifting()
    })

    this.stripePlans.on('change:annualStripePlan', (model, value) => {
      console.log(model, value)
      // debugger
      this.shoppingCart.updateDefaultAnnual(value)
      this.gifting.updateGiftPrice(value)
      this.set('annualStripePlan', value)
    })

    this.stripePlans.on('change:monthlyStripePlan', (model, value) => {
      console.log(model, value)
      // debugger
      this.shoppingCart.updateDefaultMonthly(value)
      this.gifting.updateGiftCurrency(value)
      this.set('monthlyStripePlan', value)
    })

    this.on('change:DiscountRate', (model, value) => {
      console.log(model, value)
      // debugger
      // this.gifting.discountRateGiftPricing(value)
      this.unset('DiscountRate', { silent: true })
    })

    // this.on('change:monthlyStripePlan', (model, value) => {
    //   console.log(model, value)
    //   // debugger
    //   this.gifting.updateGiftCurrency(value)
    // })

    // console.log(this.localStorage)
    const store = getLocalStorage(this)
    // console.log(store)
    if (_.isEmpty(store.records)) {
      this.fetchInitializeApp()
    }
  }

  parse(response) {
    console.log('InitializeApp parse')
    console.log(response)
    const data = response
    if (_.isEmpty(data)) {
      return data
    }
    this.set(data)
    this.set({
      environment: this.environment(),
      signinEnv: this.signinEnv(),
      signupEnv: this.signupEnv(),
      storeEnv: this.storeEnv(),
      currentLanguage: docCookies.getItem('ATVLocale') || 'en',
      cart: this.shoppingCart,
      gifting: this.gifting,
    })

    // If this is a brand new account never been created then go to signup
    // if (!this.has('Customer')) {
    //   const signinURL = `${this.get('signinEnv')}/signin.jsp?OperationalScenario=STORE`
    //   window.location.assign(signinURL)
    // }

    const storage = getLocalStorage(this)
    if (!_.isEmpty(storage.records)) {
      this.getStorageContent()
    } else {
      // this.sync('create', this)
      // console.log(this.localStorage.findAll())
    }

    // A Hack for local developement to mimic Java servlet
    // if (!docCookies.getItem('ATVSessionCookie')) {
    if (process.env.NODE_ENV === 'development') {
      // debugger
      docCookies.setItem('ATVSessionCookie', response.Session.SessionID)
    }

    return data
  }

  fetchInitializeApp() {
    console.log('InitializeApp fetchInitializeApp')
    this.fetch({
      ajaxSync: true,
    })
  }

  environment() {
    let env = ''
    if (window.location.hostname.indexOf('dev') > -1) {
      env = 'dev.'
    }
    if (window.location.hostname.indexOf('qa') > -1) {
      env = 'qa.'
    }
    if (process.env.NODE_ENV === 'development') {
      env = process.env.ENVIRONMENT
    }
    return env
  }

  signinEnv() {
    return `${window.location.protocol}//${window.location.hostname.replace('store', 'signup')}`
  }

  signupEnv() {
    return `${window.location.protocol}//${window.location.hostname.replace('store', 'signup')}`
  }

  storeEnv() {
    return `${window.location.protocol}//${window.location.hostname.replace('store', 'store')}`
  }

  getStorageContent() {
    const id = this.localStorage._getItem(this.get('localStorageID'))
    // console.log(id)
    const name = this.localStorage._itemName(id)
    // console.log(name)
    const item = this.localStorage._getItem(name)
    // console.log(item)
    const storage = this.localStorage.serializer.deserialize(item)
    console.log(storage)

    return storage
  }

  subscriptionUpdated(model) {
    console.log('InitializeApp subscriptionUpdated')
    console.log(this, model)
    debugger
    this.fetchInitializeApp()
  }

  setAllowedGifting() {
    const cloudFrontCountryHeader = this.get('stripePlansCountry')
    let groupName = 'United States' // Set default groupName to the US
    // debugger
    switch (cloudFrontCountryHeader) {
      case 'AU':
      case 'NZ':
        groupName = 'Australia'
        break
      case 'CA':
        groupName = 'Canada'
        break
      case 'FK':
      case 'GB':
      case 'GG':
      case 'GI':
      case 'IM':
      case 'JE':
      case 'MT':
        groupName = 'United Kingdom'
        break
      case 'AS':
      case 'GU':
      case 'MH':
      case 'PR':
      case 'UM':
      case 'US':
      case 'USMIL':
      case 'VI':
        groupName = 'United States'
        break
      default:
        groupName = ''
    }

    const isGroupNameAllowedGifting = (groupName.length > 0)
    const isGroupNameUK = (groupName === 'United Kingdom')
    const isGroupNameAU = (groupName === 'Australia')
    const isAllowedGifting = (groupName.length > 0)
    const isUK = (groupName === 'United Kingdom')
    const isAU = (groupName === 'Australia')

    this.set({
      isGroupNameAllowedGifting,
      isGroupNameUK,
      isGroupNameAU,
      isAllowedGifting,
      isUK,
      isAU,
    })
  }
}

export default InitializeApp
