import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class EditBillingInformationBillingCheckout extends View {
  get el() {
    return '#checkoutContainer'
  }

  get template() {
    return template
  }

  initialize(options) {
    console.log('EditBillingInformationBillingCheckout initialize')
    this.i18n = options.i18n

    this.listenTo(this.model, 'editBilling:undelegateEvents', () => {
      console.log('EditBillingInformationBillingCheckout garbageCollect')
      this.remove()
      // debugger
    })

    this.render()
  }

  render() {
    console.log('EditBillingInformationBillingCheckout render')
    console.log(this.model.attributes)
    const html = this.template()
    this.$el.html(html)

    return this
  }
}

export default EditBillingInformationBillingCheckout
