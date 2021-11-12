import { View } from 'backbone'
import _ from 'underscore'

import template from './temp.html'

class BillingInfo extends View {

  get template() {
    return _.template(template)
  }

  initialize() {
    // this.render()
  }

  render() {
    const data = {
      paymentMethod: {
        webPaymentEdit: true
      }
    }

    this.$el.html(this.template(data))
  }
}

export default BillingInfo
