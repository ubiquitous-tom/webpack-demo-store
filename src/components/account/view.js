import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.css'
import template from './temp-new.html'
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
    this.accountStatus = new AccountStatus()
    this.accountInfo = new AccountInfo()
    this.billingInfo = new BillingInfo()
    // this.render()
  }

  render() {
    // const membership = this.model.has('Membership') ? this.model.get('Membership') : {};
    // const customer = this.model.has('Customer') ? this.model.get('Customer') : {};
    // const paymentMethod = this.model.has('PaymentMethod') ? this.model.get('PaymentMethod') : {};

    this.$el.html(this.template())

    // this.accountStatus().render();
    this.accountStatus.setElement(this.$('#accountStatusView')).render()
    this.accountInfo.setElement(this.$('#accountInfoView')).render()
    this.billingInfo.setElement(this.$('#billingInfoView')).render()

    return this
  }
}

export default AccountHome
