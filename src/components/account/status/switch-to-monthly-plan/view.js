import { View } from 'backbone'
// import _ from 'underscore'
import SubmitLoader from 'shared/elements/submit-loader'
import FlashMessage from 'shared/elements/flash-message'
import './stylesheet.scss'
// import loader from './loader.svg'
import template from './index.hbs'
import SwitchToMonthlyPlanModel from './model'

class SwitchToMonthlyPlan extends View {
  get el() {
    return '#account'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click button[type=reset]': 'keepAnnualPlan',
      'click button[type=submit]': 'switchToMonthly',
    }
  }

  initialize() {
    console.log('SwitchToMonthlyPlan intialize')
    console.log(this, this.model.attributes)
    this.submitLoader = new SubmitLoader()
    this.flashMessage = new FlashMessage()
    this.model = new SwitchToMonthlyPlanModel(this.model.attributes)
    // this.render()

    this.listenTo(this.model, 'change:downgradeToMonthlySuccess', (model, value, options) => {
      console.log(model, value, options)
      console.log(this)
      debugger
      this.loadingStop(model, value, options)
      this.$el.find('.switch-to-monthly-plan-container').remove()
      this.showFooter()

      this.flashMessage.onFlashMessageSet(this.model.get('flashMessage').message, this.model.get('flashMessage').type, true)
    })
  }

  render() {
    console.log('SwitchToMonthlyPlan render')
    // console.log(this.$el[0])
    // console.log(this.template())
    console.log(this.model.attributes)
    // this.$el.html(this.template())
    this.$el.append(this.template(this.model.attributes))

    this.hideFooter()

    return this
  }

  keepAnnualPlan(e) {
    console.log('SwitchToMonthlyPlan keepAnnualPlan')
    e.preventDefault()
    this.$el.find('.switch-to-monthly-plan-container').remove()
    this.showFooter()
  }

  switchToMonthly(e) {
    console.log('SwitchToMonthlyPlan switchToMonthly')
    e.preventDefault()
    this.loadingStart()
    this.model.switchToMonthly()
  }

  showFooter() {
    $('footer').show()
  }

  hideFooter() {
    $('footer').hide()
  }

  loadingStart() {
    this.$el.find('.switch-to-monthly-plan-container button[type="reset"]').prop('disabled', true)
    this.submitLoader.loadingStart(this.$el.find('.switch-to-monthly-plan-container button[type="submit"]'))
  }

  loadingStop(model, value, options) {
    console.log(model, value, options)
    this.$el.find('.switch-to-monthly-plan-container button[type="reset"]').prop('disabled', false)
    this.submitLoader.loadingStop(this.$el.find('.switch-to-monthly-plan-container button[type="submit"]'))
  }
}

export default SwitchToMonthlyPlan
