import { View } from 'backbone'
import BackBoneContext from 'core/contexts/backbone-context'
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

    this.context = new BackBoneContext()
    this.ga = this.context.getContext('ga')
    this.ga.logEvent('Downgrade Started', 'Click', 'Downgrade')

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
      const gaCategory = 'Subscription Changed'
      const gaAction = 'Downgrade'
      let gaLabel = 'Success'
      if (value) {
        this.ga.logEvent(gaCategory, gaAction, gaLabel)
        this.flashMessage.onFlashMessageSet(message, type, true)
      } else {
        gaLabel = message
        this.ga.logEvent(gaCategory, gaAction, gaLabel)
        this.flashMessage.onFlashMessageShow(message, type)
      }
    })
  }

  render() {
    console.log('SwitchToMonthlyPlan render')
    // console.log(this.model.attributes)
    let nextBillingDate = this.model.get('Membership').NextBillingDate || this.model.get('Membership').ExpirationDate
    nextBillingDate = (this.model.get('stripePlansCountry') === 'US')
      ? nextBillingDate
      : this.getLocalizedDate(nextBillingDate)
    this.model.set({ nextBillingDate })

    this.$el.append(this.template(this.model.attributes))

    this.hideFooter()

    return this
  }

  keepAnnualPlan(e) {
    console.log('SwitchToMonthlyPlan keepAnnualPlan')
    e.preventDefault()
    this.ga.logEvent('Downgrade Started', 'Click', 'Downgrade Canceled')
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

  getLocalizedDate(mmddyy) {
    const mmddyyObj = Date.parse(mmddyy)
    const d = new Date(0)
    d.setUTCMilliseconds(mmddyyObj)
    return new Intl.DateTimeFormat(
      `${this.model.get('stripePlansLang')}-${this.model.get('stripePlansCountry')}`,
      {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
    ).format(d) // this.model.formatDate(d)
  }
}

export default SwitchToMonthlyPlan
