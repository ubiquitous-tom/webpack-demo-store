import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

import EditBillingDetailsTagline from './tagline/view'
import EditBillingDetailsOrderSummary from './order-summary/view'

class EditBillingDetails extends View {
  get el() {
    return '#edit-billing-details'
  }

  get template() {
    return template
  }

  initialize(options) {
    console.log('EditBillingDetails initialize')
    this.i18n = options.i18n

    this.listenTo(this.model, 'editBilling:undelegateEvents', () => {
      console.log('EditBilling garbageCollect')
      this.remove()
      // debugger
    })

    this.render()
  }

  render() {
    console.log('EditBillingDetails render')
    console.log(this.model.attributes)
    // const html = this.template(this.model.attributes)
    // this.$el.append(html)

    this.editBillingDetailsTagline = new EditBillingDetailsTagline({
      model: this.model,
      i18n: this.i18n,
    })
    this.editBillingDetailsOrderSummary = new EditBillingDetailsOrderSummary({
      model: this.model,
      i18n: this.i18n,
    })

    return this
  }
}

export default EditBillingDetails
