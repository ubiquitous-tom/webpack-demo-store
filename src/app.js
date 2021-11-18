import Backbone from 'backbone'
import $ from 'jquery'
import 'bootstrap'
// import 'fancybox'
import 'bootstrap/dist/css/bootstrap.css'
// import 'fancybox/dist/css/jquery.fancybox.css'

import './app.css'

// import 'common/template'
import 'common/handlebars'
// import { tagName, template, on } from 'common/decorators'
import InitializeApp from 'common/models/initializedapp'
import Workspace from 'routers/router'
import ATVModel from 'common/model'

import Header from 'shared/header'
import Footer from 'shared/footer'
import Navigation from 'shared/navigation'

$(function () {
  const initializeApp = new InitializeApp()
  initializeApp.on('sync', (model) => {
    // console.log(model)
    // console.log(model.attributes)
    new ATVModel(model.attribute)
    new Workspace({ model: model })

    console.log('main entry')
    const navigation = new Navigation({ model: model })
    const header = new Header({ model: model })
    const footer = new Footer()
    Backbone.history.start()
  })
})

