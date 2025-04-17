import { View } from 'backbone'
import _ from 'underscore'

import atvlogo from 'img/atvlogo.png'
import './stylesheet.scss'
import BackBoneContext from 'core/contexts/backbone-context'
import template from './index.hbs'

import HeaderModel from './model'

class Header extends View {
  get el() {
    return 'header'
  }

  get template() {
    // already passed Handlebars.compile() from `handlebars-loader`
    // console.log(template)
    return template
    // return _.template(template)
  }

  initialize(options) {
    console.log('Header initialize')
    this.i18n = options.i18n
    this.context = new BackBoneContext()
    this.mp = this.context.getContext('mp')

    const attributes = {
      environment: this.model.get('environment'),
      isUK: this.model.get('isUK'),
      isAU: this.model.get('isAU'),
    }
    this.headerModel = new HeaderModel(attributes)
    this.headerModel.fetchData()

    this.listenTo(this.headerModel, 'change:headerNavSuccess', (model, value) => {
      console.log(model, value)
      // debugger
      if (value) {
        // this.render()
        this.renderHeaderLinks()
      }
    })

    this.listenTo(this.model, 'change:Session', (model, value) => {
      console.log(model, value)
      // debugger
      this.headerModel.fetchData()
      this.render()
    })

    this.render()
  }

  render() {
    console.log('Header render')
    // https://gist.github.com/kyleondata/3440492
    // const template = Handlebars.compile(this.template)
    console.log(this.model.attributes, this.headerModel.attributes)
    // debugger

    const isLoggedIn = this.model.has('Session') ? this.model.get('Session').LoggedIn : false
    const isWebPaymentEdit = this.model.has('Customer') && this.model.get('Customer').webPaymentEdit

    const attributes = {
      isLoggedIn,
      isWebPaymentEdit,
      signupEnv: this.model.get('signupEnv'),
      environment: this.model.get('environment'),
      atvlogo,
      navData: this.headerModel.has('navData') ? this.headerModel.get('navData') : null,
    }
    const html = this.template(attributes)
    this.$el.html(html)

    this.$el.find('li.navbar-right').on('click', (e) => this.logEvent(e))

    return this
  }

  renderHeaderLinks() {
    const navData = this.headerModel.get('navData')
    // let html = ''
    _.each(navData, (element) => {
      const li = $('<li />')
      $('<a />')
        .attr('href', element.headerNavURL)
        .text(this.i18n.t(element.i18nKey))
        .on('click', (e) => this.logClickEvent(e))
        .appendTo(li)
      // html += `<li><a href="${element.headerNavURL}">${this.i18n.t(element.i18nKey)}</a></li>`
      this.$('ul.nav').append(li)
    })
    // this.$('ul.nav').append(html)
  }

  logEvent(e) {
    console.log('Header logEvent', e)
    // debugger
    this.logClickEvent(e)
    if ($(e.currentTarget).attr('class').includes('navbar-right')) {
      const currentClass = $(e.target).attr('class')
      const currentClassLabel = $(e.target).text().trim()
      let customEventName = ''
      switch (currentClass) {
        case 'log-in':
          customEventName = 'sign_in_page_cta'
          break
        case 'free-month':
          customEventName = 'create_account_cta'
          break
        default:
          customEventName = ''
      }
      console.log(currentClass, currentClassLabel, customEventName)
      if (customEventName) {
        this.logCustomClickEvent(
          e,
          customEventName,
          {
            catagory: 'guest_nav',
            component: 'header',
            label: currentClassLabel,
          },
        )
      }
    }
  }

  logClickEvent(e) {
    console.log('Header logClickEvent', e)
    // debugger
    this.mp.logClickEvent(e)
  }

  logCustomClickEvent(e, customEventName, additionalData) {
    console.log('Header logCustomClickEvent', e, customEventName, additionalData)
    // debugger
    this.mp.logClickEvent(e, customEventName, additionalData)
  }
}

export default Header
