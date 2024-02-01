import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

import EditBillingDetailsTagline from './tagline/view'
import EditBillingDetailsOrderSummary from './order-summary/view'

class EditBillingDetails extends View {
  get el() {
    return '#content-section'
  }

  get template() {
    return template
  }

  initialize(options) {
    console.log('EditBillingDetails initialize')
    this.i18n = options.i18n

    this.editBillingDetailsTagline = new EditBillingDetailsTagline({
      model: this.model,
      i18n: this.i18n,
    })

    this.editBillingDetailsOrderSummary = new EditBillingDetailsOrderSummary({
      model: this.model,
      i18n: this.i18n,
    })

    // this.render()
  }

  render() {
    console.log('EditBillingDetails render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this
      .$('.billing.store.container')
      .append(html)

    this.editBillingDetailsTagline.render()
    this.editBillingDetailsOrderSummary.render()

    return this
  }
}

export default EditBillingDetails
