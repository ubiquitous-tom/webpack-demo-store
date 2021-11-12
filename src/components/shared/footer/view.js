import { View } from 'backbone'
import _ from 'underscore'
import Handlebars from 'handlebars'

import './stylesheet.css'
import template from './temp.html'
import FooterModel from './model'
// import ATVLocale from 'common/models/locale'

class Footer extends View {

  // get defaults() {
  //   return {
  //     currentYear: new Date().getFullYear()
  //   }
  // }

  get el() {
    return 'footer'
  }

  get events() {
    return {
      'change #atvLocale': 'updateLanguage'
    }
  }

  get template() {
    return template
    // return _.template(template)
  }

  initialize() {
    console.log('Footer initialize')
    // this.model = new ATVLocale()
    this.model = new FooterModel()
    // console.log(this.model)
    // this.model.fetch()
    //   .done((resp) => {
    //     console.log('Footer initialize done')
    //     // console.log(resp)
    //     this.render()
    //   })
    // this.listenTo(this.model, 'change', this.render)
    // this.setElement($('footer'))
    // this.getCurrentYear()
    this.render()
  }

  // getCurrentYear() {
  //   const footerModel = new FooterModel()
  //   // console.log(footerModel.get('currentYear'))
  //   footerModel.get('currentYear')
  //   this.model.set('currentYear', footerModel.get('currentYear'))
  // }

  updatelanguage(e) {
    console.log(e)
    console.log(this.model())
    this.trigger('changeLang', e.target.value)
  }

  isSelected() {
    // Handlebars.registerHelper('isSelected', (value, options) => {
    //   console.log(value, options)
    //   if (options.fn(this).indexOf(value)>= 1) {
    //     return 'selected'
    //   }
    // })
    Handlebars.registerHelper('option', function (value, currentSelection) {
      // console.log(value, currentSelection, this.toString(), this)
      var selected = value.toLowerCase() === currentSelection ? 'selected' : '';
      return '<option value="' + value + '" ' + selected + '>' + this + '</option>';
    });
  }

  render() {
    console.log('Footer render')
    // console.log(this.model.toJSON())
    this.isSelected()

    const template = Handlebars.compile(this.template)
    // console.log(template)
    const html = template(this.model.attributes)
    // console.log(html)
    this.$el.html(html)

    // this.$el.html(this.template(this.model.attributes))

    return this
  }
}

export default Footer
