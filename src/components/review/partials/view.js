import { View } from 'backbone'

// import './stylesheet.scss'
import template from './modal.hbs'

class ReviewModal extends View {
  get el() {
    return '.review.store.container'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click #reviewPurchaseModal button': 'remove',
    }
  }

  initialize(options) {
    console.log('ReviewModal initialize')
    this.i18n = options.i18n
  }

  render() {
    this.removeLoader()
    console.log(this.model.attributes)
    const attributes = {
      message: this.i18n.t('ACCOUNT-EXISTS'),
    }
    const html = this.template(attributes)
    this.$el.after(html)

    this.$el.find('#reviewPurchaseModal').on('hidden.bs.modal', () => {
      this.$el.find('#reviewPurchaseModal').remove()
      this.model.trigger('review:clearPurchase')
    })

    // this.$el.find('#reviewPurchaseModal .modal-body')
    //   .append(`<p>${this.i18n.t('NO-ACCOUNT-CHARGES')}</p>`)
    // this.$el.find('#reviewPurchaseModal .modal-body')
    //   .append(`<p>${this.i18n.t('CAN-EDIT-ORDER')}</p>`)
    this.$el
      .find('#reviewPurchaseModal .modal-body')
      .append(`<p>${this.i18n.t('NO-ACCOUNT-CHARGES')}</p><p>${this.i18n.t('CAN-EDIT-ORDER')}</p>`)

    this.$el
      .find('#reviewPurchaseModal')
      .modal()

    return this
  }

  modalClear() {
    const attributes = {
      header: this.i18n.t('CANCELED-ORDER'),
      body: `<p>${this.i18n.t('NO-ACCOUNT-CHARGES')}</p><p>${this.i18n.t('CAN-EDIT-ORDER')}</p>`,
    }
    const html = this.template(attributes)
    this.$el.after(html)

    this.$el.find('#reviewPurchaseModal').on('hidden.bs.modal', () => {
      this.$el.find('#reviewPurchaseModal').remove()
      this.model.trigger('review:clearPurchase')
    })

    this.$el
      .find('#reviewPurchaseModal')
      .modal()
  }

  modalError(message) {
    const attributes = {
      header: 'Error',
      body: message,
    }
    const html = this.template(attributes)
    this.$el.after(html)

    this.$el.find('#reviewPurchaseModal').on('hidden.bs.modal', () => {
      this.$el.find('#reviewPurchaseModal').remove()
    })

    this.$el
      .find('#reviewPurchaseModal')
      .modal()

    this.$el
      .find('.submit-order')
      .prop('disabled', false)
  }

  remove() {
    this.$el.find('#reviewPurchaseModal').remove()
  }

  displayLoader() {
    const loader = `<i class="icon-spinner icon-spin icon-large"></i> ${this.i18n.t('CHECKING-FOR-ACCOUNT')}`
    const modal = $('<div>')
      .attr({ id: 'signInAlert' })
      .addClass('alert alert-info')
      .html(loader)
    // debugger
    this.$el
      .find('#signUpForm')
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

export default ReviewModal
