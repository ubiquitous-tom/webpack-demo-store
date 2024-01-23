import { View } from 'backbone'

import template from './index.hbs'

class EditBillingInformationBillingStatusModal extends View {
  get el() {
    return '#signInForm'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click .btn-confirmation': 'confirmation',
    }
  }

  initialize() {
    console.log('EditBillingInformationBillingStatusModal initialize')
  }

  render() {
    this.removeLoader()

    const attributes = {
      message: this.i18n.t('ACCOUNT-EXISTS'),
    }
    const html = this.template(attributes)

    this.$el.after(html).modal()

    // this.$el
    //   .find('#SignInStatus')
    //   .html(this.i18n.t('ACCOUNT-EXISTS'))

    this.$el.find('#updateBillingModal').on('hidden.bs.modal', () => {
      this.$el.find('#updateBillingModal').remove()
    })

    // this.$el
    //   .find('#signInModal')
    //   .modal()
  }

  confirmation() {
    this.$el.find('#updateBillingModal').remove()
  }

  displayLoader() {
    const loader = `<i class="icon-spinner icon-spin icon-large"></i> ${this.i18n.t('CHECKING-FOR-ACCOUNT')}`
    const modal = $('<div>')
      .attr({ id: 'updateBillingAlert' })
      .addClass('alert alert-info')
      .html(loader)
    debugger
    this.$el
      .find('.form-trial-signup')
      .after(modal)
      .slideDown()
  }

  removeLoader() {
    this.$el
      .find('#updateBillingModal')
      .slideUp()
      .remove()
  }

  // displayModal() {
  //   this.removeLoader()
  //   const modal = this.modalTemplate(modalTemplate)
  //   this.$el
  //     .find('#signUpForm')
  //     .after(modal)

  //   this.$el
  //     .find('#SignInStatus')
  //     .html(this.i18n.t('ACCOUNT-EXISTS'))

  //   this.$el.find('#signInModal').on('hidden.bs.modal', () => {
  //     this.$el.find('#signInModal').remove()
  //   })

  //   this.$el
  //     .find('#signInModal')
  //     .modal()
  // }
}

export default EditBillingInformationBillingStatusModal
