import Backbone from 'backbone'
import 'bootstrap'
import './app.scss'

// import 'common/template'
// import { tagName, template, on } from 'common/decorators'

// import BackBoneContext from 'components/common/contexts/backbone-context'
import StorageExpiry from 'components/common/models/storage-expiry'
import ATVLocale from 'components/common/models/locale'
import ATVView from 'common/view'
import InitializeApp from 'common/models/initializedapp'
import Workspace from 'routers/router'
import ATVModel from 'common/model'

import Header from 'shared/header'
import Footer from 'shared/footer'
import Navigation from 'shared/navigation'
import I18n from 'components/common/i18n'
import GoogleAnalyticsContext from 'components/common/contexts/google-analytics-context'
import LocaleContext from 'components/common/contexts/locale-context'

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
    const initializeApp = new InitializeApp()
    initializeApp.on('sync', (model) => {
      // console.log(model)
      // console.log(model.attributes)
      new GoogleAnalyticsContext({ model })
      new ATVModel()
      new ATVView({ model, i18n })
      new Workspace({ model, i18n })

      console.log('main entry')
      new Navigation({ model })
      new Header({ model })
      new Footer({ model: localeModel, i18n })

      Backbone.history.start()
    })
  })
})
