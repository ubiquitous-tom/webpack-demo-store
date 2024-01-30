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
    this.$el
      .find('#updateBillingModal')
      .modal()
    // debugger
    this.$el
      .find('#updateBillingModal')
      .on('hidden.bs.modal', () => {
        this.$el.find('#updateBillingModal').remove()
        this.model.trigger('membership:editBillingSubmitted')
      })

    return this
  }
}

export default EditBillingInformationBillingStatusModal
