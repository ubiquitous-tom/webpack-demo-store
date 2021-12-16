import { View } from 'backbone'
// https://github.com/handlebars-lang/handlebars.js/issues/1553
import * as Handlebars from 'handlebars/runtime'
import docCookies from 'doc-cookies'
import './stylesheet.scss'
import template from './index.hbs'
import FooterModel from './model'

class Footer extends View {
  get el() {
    return 'footer'
  }

  get events() {
    return {
      'change #atvLocale': 'updateLanguage',
    }
  }

  get template() {
    return template
  }

  initialize(options) {
    console.log('Footer initialize')
    this.i18n = options.i18n
    this.model = new FooterModel(this.model.attributes)

    // render for sync
    // this.listenTo(this.model, 'change', this.render)

    // render for localStorage
    this.render()
  }

  render() {
    console.log('Footer render')
    this.isSelected()
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    // console.log(html)
    this.$el.html(html)

    return this
  }

  updateLanguage(e) {
    console.log(e)
    console.log(this.model.attributes, e.target.value)
    const currentLocale = e.target.value
    docCookies.setItem('ATVLocale', currentLocale)
    this.model.set('currentLanguage', currentLocale || 'en')
    window.location.reload()
  }

  isSelected() {
    Handlebars.registerHelper('option', (value, currentSelection, context) => {
      // console.log(value, currentSelection, context.toString(), context)
      const selected = value.toLowerCase() === currentSelection ? 'selected' : ''
      return `<option value="${value}" ${selected}>${context}</option>`
    })
  }
}

export default Footer
