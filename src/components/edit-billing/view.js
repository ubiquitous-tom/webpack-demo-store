import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'
import EditBillingDetails from './details'
// import EditBillingInformation from './information'

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

    this.editBillingDetails = new EditBillingDetails({
      model: this.model,
      i18n: this.i18n,
    })

    // this.editbillingInformation = new EditBillingInformation({
    //   model: this.model,
    //   i18n: this.i18n,
    // })

    // this.render()
  }

  render() {
    console.log('EditBilling render')
    console.log(this.model.attributes)
    const html = this.template()
    this.$el.html(html)

    this.editBillingDetails.render()

    return this
  }
}

export default EditBilling
