import { Model } from 'backbone'
import _ from 'underscore'
import docCookies from 'doc-cookies'
import { LocalStorage } from 'backbone.localstorage'
import { getLocalStorage } from 'backbone.localstorage/src/utils'
import ATVModel from 'common/model'

class ATVLocale extends ATVModel {

  get defaults() {
    return {
      localStorageID: 'atv-locale',
      currentLanguage: 'en',
    }
  }

  get url() {
    console.log('ATVLocale url')
    const env = this.environment()
    console.log(env)
    return 'https://app.rlje.net/' + env + 'i18n/api/lang.json'
  }

  initialize() {
    console.log('ATVLocale initialize')
    this.localStorage = new LocalStorage(this.get('localStorageID'))
    const storage = getLocalStorage(this)
    // console.log(storage)
    if (_.isEmpty(storage.records)) {
      console.log('ATVLocale initialize fetch')
      this.fetch({
        ajaxSync: true
      })
    } else {
      console.log('ATVLocale initialize updateModel')
      this.updateModel(this.get('localStorageID'), this)
    }
    this.getLocale()
  }

  parse(response) {
    console.log('ATVLocale Model parse')
    console.log(response)
    if (!_.isEmpty(this.localStorage.findAll())) {
      this.getStorageContent(this.get('localStorageID'))
    } else {
      if (!_.isEmpty(response[0])) {
        console.log('ATVLocale Model parse noEmpty')
        const langObj = _.pick(response[0], 'languages')
        const trObj = _.pick(response[0], 'tr')
        // console.log(langObj, trObj)
        this.set(response[0])
        this.set({
          'languages': langObj.languages,
          'translation': trObj.tr,
        })
        // console.log(this.get('languages'))
        // console.log(this.get('translation'))
        // _.each(this.get('langs'), (value, key, list) => {
        //   console.log(value, key)
        // })

        this.sync('create', this)
        // console.log(this.localStorage.findAll())
      }
    }
    // Where the magic happens.
    return response[0]
  }

  environment() {
    // console.log(window.location.hostname)
    // console.log(window.location.hostname.indexOf('dev') > -1)
    const env = window.location.hostname.indexOf('dev') > -1
      ? 'dev/'
      : window.location.hostname.indexOf('qa') > -1
        ? 'qa/'
        : ''
    // console.log(env)
    return 'dev/' //env
  }

  getLocale() {
    console.log('ATVLocale getLocale')
    // const sessionID = docCookies.getItem('ATVSessionCookie')
    // console.log(sessionID)
    if (docCookies.hasItem('ATVLocale')) {
      console.log('ATVLocale getLocale has ATVLocale')
      const atvLocale = docCookies.getItem('ATVLocale')
      this.set('currentLanguage', atvLocale)
    } else {
      console.log('HeaderATVLocaleodel getLocale DOES NOT have ATVLocale')
    }
    // console.log(this.attributes)
  }

  // getStorageContent() {
  //   const id = this.localStorage._getItem(this.get('localStorageID'))
  //   // console.log(id)
  //   const name = this.localStorage._itemName(id)
  //   // console.log(name)
  //   const item = this.localStorage._getItem(name)
  //   // console.log(item)
  //   const storage = this.localStorage.serializer.deserialize(item)
  //   // console.log(storage)

  //   return storage
  // }

  // updateModel() {
  //   console.log('ATVLocale updateModel')
  //   const storage = this.getStorageContent()
  //   // console.log(storage)
  //   this.set(storage)
  // }
}

export default ATVLocale
