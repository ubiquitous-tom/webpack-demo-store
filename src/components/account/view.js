import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.css'
import template from './temp-new.html'

import AccountHomeModel from './model'
import AccountStatus from './status'
import AccountInfo from './info'
import BillingInfo from './billing'

class AccountHome extends View {

  get el() {
    return 'section'
  }

  get template() {
    return _.template(template)
  }

  get events() {
    return {
      'click a': 'navigate'
    }
  }

  initialize() {
    console.log('AccountHome initialize')
    console.log(this.model.attributes)
    this.model = new AccountHomeModel(this.model.attributes)
    // console.log(this.model)
    // this.render()
    this.listenTo(this.model, 'sync', this.render)
  }

  render() {
    console.log('AccountHome render')
    // console.log(this.model.attributes)
    // const membership = this.model.has('Membership') ? this.model.get('Membership') : {};
    // const customer = this.model.has('Customer') ? this.model.get('Customer') : {};
    // const paymentMethod = this.model.has('PaymentMethod') ? this.model.get('PaymentMethod') : {};
    // console.log(this.$el[0])
    this.$el.html(this.template())

    // this.accountStatus().render();
    // this.accountStatus.setElement(this.$('#accountStatusView')).render()
    // this.accountInfo.setElement(this.$('#accountInfoView')).render()
    // this.billingInfo.setElement(this.$('#billingInfoView')).render()

    // Initialize late in order for all the element to be added to the main dom
    this.accountStatus = new AccountStatus({ model: this.model })
    this.accountInfo = new AccountInfo({ model: this.model })
    this.billingInfo = new BillingInfo({ model: this.model })

    return this
  }

  stuff() {
    console.log('AccountHome stuff')
    this.billingInfo = new BillingInfo({ initializeApp: this.model })
  }
}

export default AccountHome
