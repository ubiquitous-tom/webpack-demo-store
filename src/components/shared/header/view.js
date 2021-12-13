import { View } from 'backbone'
// import _ from 'underscore'
import atvlogo from '../../../assets/images/atvlogo.png'
import './stylesheet.scss'
import template from './index.hbs'
// import template from './temp-test.html'
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

  initialize() {
    console.log('Header initialize')
    // this.model = new HeaderModel()
    this.model.set('atvlogo', atvlogo)
    this.render()
  }

  render() {
    // https://gist.github.com/kyleondata/3440492
    // const template = Handlebars.compile(this.template)
    // console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    // console.log(html)
    this.$el.html(html)

    // this.$el.html(this.template(this.model.attributes))

    this.activateNavigation()

    return this
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
