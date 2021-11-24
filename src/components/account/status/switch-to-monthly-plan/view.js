import { View } from 'backbone'
import _ from 'underscore'

// import './stylesheet.css'
import './stylesheet.scss'
import loader from './loader.svg'
import template from './index.html'
import SwitchToMonthlyPlanModel from './model'
import FlashMessage from 'shared/elements/flash-message/view'

class SwitchToMonthlyPlan extends View {

  get el() {
    return '#account'
  }

  get template() {
    return _.template(template)
  }

  get events() {
    return {
      'click button[type=reset]': 'keepAnnualPlan',
      'click button[type=submit]': 'switchToMonthly',
    }
  }

  initialize(options) {
    console.log('SwitchToMonthlyPlan intialize')
    console.log(this, this.model.attributes)
    this.dispatcher = options.dispatcher
    this.flashMessage = new FlashMessage()
    this.model = new SwitchToMonthlyPlanModel(this.model.attributes)
    // this.render()

    this.listenTo(this.model, 'change:downgradeToMonthlySuccess', (model, value, options) => {
      console.log(model, value, options)
      console.log(this)
      debugger
      this.$el.find('.switch-to-monthly-plan-container').remove()
      this.showFooter()
      // this.dispatcher.trigger('subscription:updated', this)
      this.flashMessage.onFlashMessageSet(this.model.get('flashMessage').message, this.model.get('flashMessage').type)
      this.dispatcher.trigger('downgradeToMonthly:success', this)
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
    this.model.switchToMonthly()
  }

  showFooter() {
    $('footer').show()
  }

  hideFooter() {
    $('footer').hide()
  }
}

export default SwitchToMonthlyPlan
