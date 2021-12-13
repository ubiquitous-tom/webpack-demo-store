import { View } from 'backbone'
// https://github.com/handlebars-lang/handlebars.js/issues/1553
import * as Handlebars from 'handlebars/runtime'
import Polyglot from 'node-polyglot'

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

  initialize() {
    console.log('Footer initialize')
    this.polyglot = new Polyglot()
    this.model = new FooterModel()

    // render for sync
    this.listenTo(this.model, 'change', this.render)
    // render for localStorage
    this.render()
  }

  updatelanguage(e) {
    console.log(e)
    console.log(this.model())
    this.trigger('changeLang', e.target.value)
  }

  isSelected() {
    Handlebars.registerHelper('option', (value, currentSelection, context) => {
      // console.log(value, currentSelection, context.toString(), context)
      const selected = value.toLowerCase() === currentSelection ? 'selected' : ''
      return `<option value="${value}" ${selected}>${context}</option>`
    })
  }

  render() {
    console.log('Footer render')
    this.isSelected()

    // console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    // console.log(html)
    this.$el.html(html)

    return this
  }
}

export default Footer
