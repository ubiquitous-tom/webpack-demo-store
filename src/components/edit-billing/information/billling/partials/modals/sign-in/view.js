import { View } from 'backbone'

import template from './index.hbs'

class EditBillingInformationBillingSignInModal extends View {
  get el() {
    return '#edit-billing-information'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('EditBillingInformationBillingSignInModal initialize')
  }

  render() {
    console.log('EditBillingInformationBillingSignInModal render')
    const html = this.template()
    this.$el
      .find('.form-trial-signup')
      .after(html)
    this.$el
      .find('#signInModal')
      .modal()
    // debugger
    this.$el
      .find('#signInModal')
      .on('hidden.bs.modal', () => {
        this.$el.find('#signInModal').remove()
        this.model.trigger('membership:editBillingSignIn')
      })

    return this
  }
}

export default EditBillingInformationBillingSignInModal
