import { Model } from 'backbone'
import EventEmitter from 'events'
import * as Handlebars from 'handlebars/runtime'
import docCookies from 'doc-cookies'
import Polyglot from 'node-polyglot'

class I18n extends Model {
  initialize(phrases) {
    console.log('I18n initialize')
    this.eventEmitter = new EventEmitter()
    this.currentLocale = docCookies.getItem('ATVLocale') || 'en'
    this.polyglot = new Polyglot({
      phrases,
      locale: this.currentLocale,
    })
    this.setHTMLLang()
    this.debugHelper()
    this.tHelper()

    this.eventEmitter.on('language:change', (lang) => {
      console.log(lang)
      this.currentLocale = lang
      this.polyglot.locale(this.currentLocale)
      debugger
      console.log(this.polyglot)
    })
  }

  setHTMLLang() {
    $('html').attr('lang', this.currentLocale)
  }

  debugHelper() {
    Handlebars.registerHelper('debug', (optionalValue) => {
      console.log('Current Context')
      console.log('====================')
      console.log(this)

      if (optionalValue) {
        console.log('Value')
        console.log('====================')
        console.log(optionalValue)
      }
    })
  }

  tHelper() {
    Handlebars.registerHelper('t', (translationKey, options) => {
      // console.log(translationKey, options)
      // console.log(this, this.polyglot)
      const interpolationOptions = options.data.root
      // this.currentLocale = options.lookupProperty(options.data.root, 'currentLanguage') || 'en'
      // debugger
      // const translated = this.polyglot.has(`${translationKey}.content.${this.currentLocale}`)
      //   ? this.polyglot.t(`${translationKey}.content.${this.currentLocale}`)
      //   : translationKey
      // console.log(translated)
      // return translated
      return this.t(translationKey, interpolationOptions)
    })
  }

  t(translationKey, interpolationOptions) {
    return this.polyglot.has(`${translationKey}.content.${this.currentLocale}`)
      ? this.polyglot.t(`${translationKey}.content.${this.currentLocale}`, interpolationOptions)
      : translationKey
  }
}

export default I18n
