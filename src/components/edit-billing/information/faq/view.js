import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class EditBillingInformationFaq extends View {
  get el() {
    return '#billingFAQ'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('EditBillingInformationFaq initialize')

    this.render()
  }

  render() {
    console.log('EditBillingInformationFaq render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.append(html)

    return this
  }
}

export default EditBillingInformationFaq
