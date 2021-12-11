import Backbone from 'backbone'
// import $ from 'jquery'
import 'bootstrap'
// import 'fancybox'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'fancybox/dist/css/jquery.fancybox.css'

import './app.scss'

// import 'common/template'
import 'common/handlebars'
// import { tagName, template, on } from 'common/decorators'

import InitializeApp from 'common/models/initializedapp'
import Workspace from 'routers/router'
import ATVModel from 'common/model'

import Header from 'shared/header'
import Footer from 'shared/footer'
import Navigation from 'shared/navigation'
import ATVView from 'common/view'

console.log(`Looks like we are in ${process.env.NODE_ENV} mode!`)
console.log(`${process.env.RLJE_API_ENVIRONMENT}api.rlje.net`)
console.log(`account${process.env.API_ENVIRONMENT}.acorn.tv`)

$(() => {
  const initializeApp = new InitializeApp()
  initializeApp.on('sync', (model) => {
    console.log(model)
    console.log(model.attributes)
    new ATVModel()
    new ATVView()
    new Workspace({ model })

    console.log('main entry')
    new Navigation({ model })
    new Header({ model })
    new Footer()

    Backbone.history.start()
  })
})
