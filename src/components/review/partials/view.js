import { Model, View } from 'backbone'

// import './stylesheet.scss'
import template from './modal.hbs'

class ReviewModal extends View {
  get el() {
    return '#content-section'
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

    this.reviewModel = new Model()

    this.listenTo(this.reviewModel, 'modalClearClose', () => {
      console.log('ReviewModal modalClearClose', this.model)
      this.model.trigger('review:clearPurchase')
    })
  }

  render() {
    console.log(this.model.attributes)
    const html = this.template()
    this.$el
      .find('.review.store.container')
      .append(html)

    return this
  }

  modalClear() {
    this.render()
    // debugger
    this.$el
      .find('#reviewPurchaseModal .modal-header h4')
      .html(`<p>${this.i18n.t('CANCELED-ORDER')}</p>`)

    this.$el
      .find('#reviewPurchaseModal .modal-body')
      .html(`<p>${this.i18n.t('NO-ACCOUNT-CHARGES')}</p><p>${this.i18n.t('CAN-EDIT-ORDER')}</p>`)

    this.$el.find('#reviewPurchaseModal').on('hide.bs.modal', (e) => {
      console.log('#reviewPurchaseModal hide.bs.modal', e)
      this.$el
        .find('#reviewPurchaseModal')
        .remove()
      this.reviewModel.trigger('modalClearClose')
    })

    this.$el
      .find('#reviewPurchaseModal')
      .modal()
  }

  modalError(message) {
    this.render()
    // debugger
    this.$el
      .find('#reviewPurchaseModal .modal-header h4')
      .html(`<p>${this.i18n.t('ERROR')}</p>`)

    this.$el
      .find('#reviewPurchaseModal .modal-body')
      .html(`<p>${message}</p>`)

    this.$el.find('#reviewPurchaseModal').on('hidden.bs.modal', (e) => {
      console.log('#reviewPurchaseModal hide.bs.modal', e)
      this.$el
        .find('#reviewPurchaseModal')
        .remove()
    })

    this.$el
      .find('#reviewPurchaseModal')
      .modal()
  }
}

export default ReviewModal
