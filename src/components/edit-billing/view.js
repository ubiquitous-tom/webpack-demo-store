import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'
import EditBillingDetails from './details'
import EditBillingInformation from './information'

class EditBilling extends View {
  get el() {
    return '#content-section'
  }

  get template() {
    return template
  }

  initialize(options) {
    console.log('EditBilling initialize')
    this.i18n = options.i18n

    this.listenTo(this.model, 'editBilling:undelegateEvents', () => {
      console.log('EditBilling garbageCollect')
      this.remove()
      // debugger
    })

    this.render()
  }

  render() {
    console.log('EditBilling render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.html(html)

    this.setElement('.billing.store.container')

    this.editBillingDetails = new EditBillingDetails({
      model: this.model,
      i18n: this.i18n,
    })

    this.editbillingInformation = new EditBillingInformation({
      model: this.model,
      i18n: this.i18n,
    })

    return this
  }
}

export default EditBilling
