import { View } from 'backbone'

import './stylesheet.scss'
import SecurePaymentPoseredStripePng from './img/secure_payments_powered_stripe.png'
import template from './index.hbs'

class EditBillingDetailsTagline extends View {
  get el() {
    return '#edit-billing-details'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('EditBillingDetailsTagline initialize')

    this.render()
  }

  render() {
    console.log('EditBillingDetailsTagline render')
    console.log(this.model.attributes)
    const attributes = {
      SecurePaymentPoseredStripePng,
    }
    const html = this.template(attributes)
    this.$el.append(html)

    return this
  }
}

export default EditBillingDetailsTagline
