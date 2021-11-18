import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.css'
import template from './index.hbs'

class PromoCode extends View {

  get el() {
    return '#account'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click a.promocode-toggle': 'promocodeToggle',
      // 'click #promocode-field button[type="reset"]': 'reset',
      'click #promocode-field button[type="submit"]': 'submit',
    }
  }

  initialize(options) {
    console.log('Promocode initialize')
    // console.log(this, options.parent)
    this.model = options.switchToAnnualPlanModel
    // this.render()
    // this.listenTo(this.model, 'change', this.render)
  }

  render() {
    console.log('Promocode render')
    // console.log(this.$el[0])
    // console.log(this.$el.find('.switch-to-annual-plan-container')[0])
    // console.log(this.$el.find('#promocode-container')[0])
    const html = this.template(this.model.attributes)
    // console.log(html)
    this.$el.find('#promocode-container').append(html)
    // this.$el.html(html)
  }

  promocodeToggle(e) {
    e.preventDefault()
    // console.log('toggle')
    // console.log(this.$el[0])
    // this.$el.find('#promocode-field').slideToggle()
    // this.$el.find('.promocode-toggle span').toggleClass('glyphicon-menu-down').toggleClass('glyphicon-menu-right');
  }

  reset(e) {
    console.log('Promocode reset')
    e.preventDefault()
    console.log(e)
  }

  submit(e) {
    console.log('Promocode submit')
    e.preventDefault()
    console.log(e)
  }
}

export default PromoCode
