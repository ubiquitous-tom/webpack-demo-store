import { Router, View } from 'backbone'
// import _ from 'underscore'
// import Handlebars from 'handlebars'

import './stylesheet.scss'
import template from './index.hbs'
// import NavigationModel from './model'

class Navigation extends View {
  get el() {
    return 'nav'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click a': 'navigate',
    }
  }

  initialize() {
    console.log('Navigation initialize')
    // this.activeNav = 'applyPromoCode'
    this.resetActive()
    this.router = new Router()
    // this.model = new NavigationModel()

    // this.listenTo(this.model, 'change', this.setActive)
    this.render()
  }

  render() {
    console.log('Navigation render')
    // const template = Handlebars.compile(this.template())
    const data = { ...this.model.attributes, Navigation: { EmailSection: this.model.get('Customer').webPaymentEdit || (this.model.get('Membership').Store === 'Tigo') } }
    const html = this.template(data)
    this.$el.html(html)
    // this.$el.html(this.template())
    // this.setActive(this.$el)

    // // A hack to get default navigation to work
    // if (!$('ul li').hasClass('active')) {
    //   const hash = !_.isEmpty(window.location.hash) ? window.location.hash : '#accountStatus'
    //   $(`${hash}Nav`).addClass('active')
    // }

    return this
  }

  navigate(e) {
    console.log('Navigation Click navigate')
    console.log(e, e.target)
    // router.navigate('/');

    this.resetActive()
    this.setActive(e.target)
  }

  resetActive() {
    console.log('resetActive')
    $('.nav-tabs li').removeClass('active')
  }

  setActive(el) {
    console.log('setActive', el)
    // console.l0g($(el), $(el).parent())
    // $('.nav-tabs li').addClass('active')
    $(el).parent().addClass('active')
    // this.$el.find(el).add('active')
  }
}

export default Navigation
