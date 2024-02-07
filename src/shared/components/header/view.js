import { View } from 'backbone'
import _ from 'underscore'

import atvlogo from 'img/atvlogo.png'
import './stylesheet.scss'
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

    const attributes = {
      environment: this.model.get('environment'),
      isUK: this.model.get('isUK'),
      isAU: this.model.get('isAU'),
    }
    this.headerModel = new HeaderModel(attributes)

    this.listenTo(this.headerModel, 'change:headerNavSuccess', (model, value) => {
      console.log(model, value)
      // debugger
      if (value) {
        // this.render()
        this.renderHeaderLinks()
      }
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

    return this
  }

  renderHeaderLinks() {
    const navData = this.headerModel.get('navData')
    let html = ''
    _.each(navData, (element) => {
      html += `<li><a href="${element.headerNavURL}">${this.i18n.t(element.i18nKey)}</a></li>`
    })
    this.$('ul.nav').append(html)
  }
}

export default Header
