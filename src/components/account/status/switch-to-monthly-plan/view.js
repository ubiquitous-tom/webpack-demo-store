import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.css'
import template from './index.html'

class SwitchToMonthlyPlan extends View {

  get el() {
    return '#account'
  }

  // get id() {
  //   return 'switch-to-monthly-plan'
  // }

  // get tagName() {
  //   return 'dialog'
  // }

  get template() {
    return _.template(template)
  }

  get events() {
    return {
      'click button[type=reset]': 'keepAnnualPlan',
      'click button[type=submit]': 'switchToMonthly',
    }
  }

  initialize() {
    console.log('SwitchToMonthlyPlan intialize')
    // this.render()
  }

  keepAnnualPlan() {
    // this.removeBackground()
    this.$el.find('.switch-to-monthly-plan-container').remove()
    this.showFooter()
  }

  switchToMonthly() {

  }

  // addBackground() {
  //   $('#account').addClass('switch-to-monthly-plan')
  // }

  // removeBackground() {
  //   $('#account').removeClass('switch-to-monthly-plan')
  // }

  showFooter() {
    $('footer').show()
  }

  hideFooter() {
    $('footer').hide()
  }

  render() {
    console.log('SwitchToMonthlyPlan render')
    console.log(this.$el[0])
    console.log(this.template())
    console.log(this.model.attributes)
    // this.$el.html(this.template())
    this.$el.append(this.template(this.model.attributes))

    // this.addBackground()
    this.hideFooter()

    return this
  }
}

export default SwitchToMonthlyPlan
