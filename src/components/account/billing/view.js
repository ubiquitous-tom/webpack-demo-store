import { View } from 'backbone'
import template from './index.hbs'

class BillingInfo extends View {
  get el() {
    return '#billingInfoView'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('BillingInfo initialize')
    const isRecordedBook = (
      this.model.has('PaymentMethod')
      && this.model.get('PaymentMethod').Store === 'RECORDEDBOOKS'
    )
    this.model.set({ isRecordedBook })
    this.render()
  }

  render() {
    console.log('BillingInfo render')
    // console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.html(html)
  }
}

export default BillingInfo
