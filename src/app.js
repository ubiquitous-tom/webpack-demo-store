import Backbone from 'backbone'
import 'bootstrap'
import './app.scss'

// import 'core/template'
// import { tagName, template, on } from 'core/decorators'

import StorageExpiry from 'core/models/storage-expiry'
import ATVLocale from 'core/models/locale'
import ATVView from 'core/view'
import StripePlans from 'core/models/stripe-plans'
import InitializeApp from 'core/models/initializedapp'
import Workspace from 'routers/router'
import ATVModel from 'core/model'
import I18n from 'core/i18n'
import GoogleAnalyticsContext from 'core/contexts/google-analytics-context'
import LocaleContext from 'core/contexts/locale-context'

import Header from 'shared/header'
import Footer from 'shared/footer'
import Navigation from 'shared/navigation'

console.log(`Looks like we are in ${process.env.NODE_ENV} mode!`)
console.log(`${process.env.RLJE_API_ENVIRONMENT}api.rlje.net`)
console.log(`account${process.env.API_ENVIRONMENT}.acorn.tv`)

$(() => {
  new StorageExpiry()
  const atvLocale = new ATVLocale()
  // console.log(atvLocale)
  atvLocale.on('sync', (localeModel) => {
    // const context = new BackBoneContext()
    // context.setContext(localeModel)
    new LocaleContext({ model: localeModel })
    // console.log(localeModel, localeModel.attributes.tr)
    const i18n = new I18n(localeModel.attributes.tr)
    const stripePlans = new StripePlans()
    stripePlans.on('sync', (stripePlansModel) => {
      const initializeApp = new InitializeApp({ stripePlansModel })
      initializeApp.on('sync', (model) => {
        // console.log(model)
        // console.log(model.attributes)
        new GoogleAnalyticsContext({ model })
        new ATVModel()
        new ATVView({ model, i18n })
        new Workspace({ model, i18n })

        console.log('main entry')
        new Navigation({ model })
        new Header({ model, i18n })
        new Footer({ model, i18n, localeModel })

        Backbone.history.start()
      })
    })
  })
})
