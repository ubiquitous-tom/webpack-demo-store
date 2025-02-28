import { View } from 'backbone'

// import './stylesheet.scss'
import template from './index.hbs'

class EditBillingInformationBillingLegal extends View {
  get el() {
    return '#legalContainer'
  }

  get template() {
    return template
  }

  initialize(options) {
    console.log('EditBillingInformationBillingLegal initialize')
    this.i18n = options.i18n

    this.listenTo(this.model, 'editBilling:undelegateEvents', () => {
      console.log('EditBillingInformationBillingLegal garbageCollect')
      this.remove()
      // debugger
    })

    this.render()
  }

  render() {
    console.log('EditBillingInformationBillingLegal render')
    console.log(this.model.attributes)
    const html = this.template()
    this.$el.html(html)

    return this
  }
}

export default EditBillingInformationBillingLegal
