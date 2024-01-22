import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class EditBillingInformationBillingAppliedCode extends View {
  get el() {
    return 'form.form-trial-signup #appliedCodeContainer'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('EditBillingInformationBillingAppliedCode initialize')

    if (this.model.has('membershipPromo')) {
      this.render()
    }
  }

  render() {
    console.log('EditBillingInformationBillingAppliedCode render')
    console.log(this.model.attributes)
    const attributes = {
      promoCode: `${this.model.get('membershipPromo')?.PromotionCode} - ${this.model.get('membershipPromo')?.Name}`,
    }
    const html = this.template(attributes)
    this.$el.html(html)

    return this
  }
}

export default EditBillingInformationBillingAppliedCode
