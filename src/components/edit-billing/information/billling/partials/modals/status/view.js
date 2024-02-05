import { View } from 'backbone'

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
        this.$el.remove()
        this.model.trigger('membership:editBillingSubmitted')
      })

    return this
  }
}

export default EditBillingInformationBillingStatusModal
