import { View } from 'backbone'
import SubmitLoader from 'shared/elements/submit-loader'
import FlashMessage from 'shared/elements/flash-message'
import './stylesheet.scss'
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

  initialize(options) {
    console.log('SwitchToMonthlyPlan intialize')
    console.log(this, this.model.attributes)
    this.submitLoader = new SubmitLoader()
    this.flashMessage = new FlashMessage()
    this.i18n = options.i18n
    this.model = new SwitchToMonthlyPlanModel(this.model.attributes)

    /* eslint no-shadow: 0 */
    this.listenTo(this.model, 'change:downgradeToMonthlySuccess', (model, value, options) => {
      console.log(model, value, options)
      console.log(this)
      debugger
      this.loadingStop(model, value, options)
      this.$el.find('.switch-to-monthly-plan-container').remove()
      this.showFooter()
      let { message } = model.get('flashMessage')
      const { interpolationOptions, type } = model.get('flashMessage')
      message = this.i18n.t(message, interpolationOptions)
      debugger
      if (value) {
        this.flashMessage.onFlashMessageSet(message, type, true)
      } else {
        this.flashMessage.onFlashMessageShow(message, type)
      }
    })
  }

  render() {
    console.log('SwitchToMonthlyPlan render')
    // console.log(this.model.attributes)
    this.model.set('nextBillingDate', this.model.get('Membership').NextBillingDate)

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
