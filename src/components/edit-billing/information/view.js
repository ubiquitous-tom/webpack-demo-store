import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

import EditBillingInformationBilling from './billling'
import EditBillingInformationFaq from './faq'

class EditBillingInformation extends View {
  get el() {
    return '.billing.store.container'
  }

  get template() {
    return template
  }

  initialize(options) {
    console.log('EditBillingInformation initialize')
    this.i18n = options.i18n

    this.render()
  }

  render() {
    console.log('EditBillingInformation render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.append(html)

    this.editBillingInformationBilling = new EditBillingInformationBilling({
      model: this.model,
      i18n: this.i18n,
    })

    this.editBillingInformationFaq = new EditBillingInformationFaq({
      model: this.model,
      i18n: this.i18n,
    })

    return this
  }
}

export default EditBillingInformation
