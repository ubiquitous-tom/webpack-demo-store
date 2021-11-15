import Backbone from 'backbone'
import $ from 'jquery'
import 'bootstrap'
// import 'fancybox'
import 'bootstrap/dist/css/bootstrap.css'
// import 'fancybox/dist/css/jquery.fancybox.css'

// import '@stripe/stripe-js';
// import { loadStripe } from '@stripe/stripe-js'

// const stripe = Stripe.loadStripe('pk_live_Riw8CYEIjVsr54nzgGIOvzKL');
// window.stripe = stripe
// console.log(stripe)
// console.log(Stripe('pk_live_Riw8CYEIjVsr54nzgGIOvzKL'))

import './app.css'

// import './components/common/template'
import './components/common/handlebars'
// import { tagName, template, on } from 'common/decorators'
import ATVModel from './components/common/model'

import Header from './components/shared/header'
import Footer from './components/shared/footer'
import Navigation from './components/shared/navigation'

import Workspace from 'routers/router'

// new ATVLocale()
// new InitializeApp()

$(function () {
  new ATVModel()
  new Workspace()
  console.log('main entry')
  const navigation = new Navigation()
  const header = new Header()
  const footer = new Footer()
  Backbone.history.start()
})

