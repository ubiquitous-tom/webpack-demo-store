import { View } from 'backbone'

import template from './index.hbs'

class EditBillingInformationBillingSignInModal extends View {
  get el() {
    return '#signInForm'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click #signInModal': 'remove',
    }
  }

  initialize() {
    console.log('EditBillingInformationBillingSignInModal initialize')
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

    // this.$el.find('#signInModal').on('hidden.bs.modal', () => {
    //   this.$el.find('#signInModal').remove()
    // })

    // this.$el
    //   .find('#signInModal')
    //   .modal()
  }

  remove() {
    this.$el.find('#signInModal').remove()
  }

  displayLoader() {
    const loader = `<i class="icon-spinner icon-spin icon-large"></i> ${this.i18n.t('CHECKING-FOR-ACCOUNT')}`
    const modal = $('<div>')
      .attr({ id: 'signInAlert' })
      .addClass('alert alert-info')
      .html(loader)
    debugger
    this.$el
      .find('#signInForm')
      .after(modal)
      .slideDown()
  }

  removeLoader() {
    this.$el
      .find('#signInAlert')
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

export default EditBillingInformationBillingSignInModal
