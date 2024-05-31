import { Model, View } from 'backbone'

import template from './index.hbs'

class EditBillingInformationBillingStatusModal extends View {
  get el() {
    return '#edit-billing-information'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('EditBillingInformationBillingStatusModal initialize')
    this.statusModalModel = new Model()
  }

  render() {
    console.log('EditBillingInformationBillingStatusModal render')
    const html = this.template()

    this.$el
      .find('.form-trial-signup')
      .after(html)

    this.setElement('#updateBillingModal')

    this.$el
      .modal()
    // debugger
    this.$el
      .on('hidden.bs.modal', () => {
        const isPaymentSuccess = this.getData('paymentSuccess')
        // debugger
        // this.$el.remove()
        if (isPaymentSuccess) {
          this.model.trigger('membership:editBillingSubmitted')
        } else {
          this.model.trigger('stripeForm:resetStripeForm')
        }
      })

    return this
  }

  setBody(content) {
    this.$('#updateBillingStatus').html(content)
  }

  setData(key, data) {
    this.statusModalModel.set(key, data)
  }

  getData(key) {
    return this.statusModalModel.get(key)
  }
}

export default EditBillingInformationBillingStatusModal
