import { View } from 'backbone'
import _ from 'underscore'

import template from './temp.hbs'
import Handlebars from 'handlebars'
class BillingInfo extends View {

  get el() {
    return 'section'
  }

  get template() {
    // return _.template(template)
    return template
  }

  initialize() {
    console.log('BillingInfo initialize')
    // console.log(this, options)
    this.render()
  }

  render() {
    console.log('BillingInfo render')
    // const data = {
    //   paymentMethod: {
    //     webPaymentEdit: true
    //   }
    // }
    console.log(this.model.attributes)
    // debugger
    // const template = Handlebars.compile(this.template())
    // console.log(template)
    const html = this.template(this.model.attributes)
    // console.log(html)
    // console.log(this.$el[0], this.$el.find('#billingInfoView')[0])
    this.$el.find('#billingInfoView').html(html)
    // this.$el.html(this.template(data))
  }
}

export default BillingInfo
