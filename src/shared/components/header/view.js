import { Router, View } from 'backbone'
// import _ from 'underscore'
import atvlogo from 'img/atvlogo.png'
import './stylesheet.scss'
import template from './index.hbs'
// import HeaderModel from './model'

class Header extends View {
  get el() {
    return 'header'
  }

  get template() {
    // already passed Handlebars.compile() from `handlebars-loaer`
    // console.log(template)
    return template
    // return _.template(template)
  }

  get events() {
    return {
      'click a': 'navigate',
    }
  }

  initialize() {
    console.log('Header initialize')
    // this.model = new HeaderModel()
    this.router = new Router()

    const isWebPaymentEdit = this.model.get('Customer').webPaymentEdit
    const isTigo = this.model.get('Membership').Store === 'Tigo'
    this.model.set({
      atvlogo,
      navigation: {
        emailSection: isWebPaymentEdit || isTigo,
      },
    })
    // this.model.set('atvlogo', atvlogo)
    this.render()
  }

  render() {
    // https://gist.github.com/kyleondata/3440492
    // const template = Handlebars.compile(this.template)
    console.log(this.model.attributes)
    // debugger
    const html = this.template(this.model.attributes)
    // console.log(html)
    this.$el.html(html)

    // this.$el.html(this.template(this.model.attributes))

    this.activateNavigation()

    return this
  }

  navigate(e) {
    console.log('Header Click navigate')
    console.log(e, e.target, e.target.hash)
    // router.navigate('/');

    this.removeOverlay()
    this.resetActive()
    this.setActive(e.target.hash)
  }

  removeOverlay() {
    console.log('removeOverlay')
    const article = $('article')
    const children = article.children('[role="dialog"]')
    console.log(article, children, children.length)
    if (children.length) {
      children.remove()
      this.showFooter()
    }
  }

  showFooter() {
    $('footer').show()
  }

  resetActive() {
    console.log('resetActive')
    $('.nav-tabs li').removeClass('active')
  }

  setActive(hash) {
    console.log('setActive', hash)
    // console.l0g($(el), $(el).parent())
    // $('.nav-tabs li').addClass('active')
    $(`li${hash}`).addClass('active')
    // this.$el.find(el).add('active')
  }

  activateNavigation() {
    $(() => {
      const sideslider = $('[data-toggle=collapse-side]')
      const sel = sideslider.attr('data-target')
      const sel2 = sideslider.attr('data-target-2')
      /* eslint no-unused-vars: 0 */
      sideslider.on('click', (e) => {
        $(sel).toggleClass('in')
        $(sel2).toggleClass('out')
      })

      // dropdown menu
      $('.menuOptions').on('click', (e) => {
        const $dropSelect = $(e.currentTarget).parent().find('.drop-select')
        if ($dropSelect.hasClass('closed')) {
          $dropSelect.slideDown(300).show()
          $dropSelect.addClass('open')
          $dropSelect.removeClass('closed')
        } else {
          $dropSelect.slideUp(400).fadeOut()
          $dropSelect.addClass('closed')
          $dropSelect.removeClass('open')
        }
        return false
      })

      $('.navbar .container').on('click', (e) => {
        const $dropSelect = $(e.currentTarget).find('.navbar-right .drop-select')
        if ($dropSelect.hasClass('open')) {
          $dropSelect.slideUp(400).fadeOut()
          $dropSelect.addClass('closed')
          $dropSelect.removeClass('open')
        }
      })
    })
  }
}

export default Header
