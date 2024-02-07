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
    this
      .$('.review.store.container')
      .append(html)

    this.setElement('#reviewPurchaseModal')

    return this
  }

  modalClear() {
    this.render()
    // debugger
    this
      .$('.modal-header h4')
      .html(`<p>${this.i18n.t('CANCELED-ORDER')}</p>`)

    this
      .$('.modal-body')
      .html(`<p>${this.i18n.t('NO-ACCOUNT-CHARGES')}</p><p>${this.i18n.t('CAN-EDIT-ORDER')}</p>`)

    this.$el.on('hide.bs.modal', (e) => {
      console.log('#reviewPurchaseModal hide.bs.modal', e)
      this.$el
        .remove()
      this.reviewModel.trigger('modalClearClose')
    })

    this.$el
      .modal()
  }

  modalError(message) {
    this.render()
    // debugger
    this
      .$('.modal-header h4')
      .html(`<p>${this.i18n.t('ERROR')}</p>`)

    this
      .$('.modal-body')
      .html(`<p>${message}</p>`)

    this.$el.on('hidden.bs.modal', (e) => {
      console.log('#reviewPurchaseModal hide.bs.modal', e)
      this.$el
        .remove()
    })

    this.$el
      .modal()
  }
}

export default ReviewModal
