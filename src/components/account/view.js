import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

import AccountHomeModel from './model'
import AccountStatus from './status'
import AccountInfo from './info'
import BillingInfo from './billing'

class AccountHome extends View {
  get el() {
    return 'section'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click a': 'navigate',
    }
  }

  initialize() {
    console.log('AccountHome initialize')
    console.log(this.model.attributes)
    this.model = new AccountHomeModel(this.model.attributes)
    // console.log(this.model)
    // this.render()
    this.listenTo(this.model, 'sync error', this.render)
    // this.listenTo(this.model, 'change', this.render)
  }

  render() {
    console.log('AccountHome render')
    this.$el.html(this.template())

    // Initialize late in order for all the element to be added to the main dom
    this.accountStatus = new AccountStatus({ model: this.model })
    this.accountInfo = new AccountInfo({ model: this.model })
    this.billingInfo = new BillingInfo({ model: this.model })

    return this
  }
}

export default AccountHome
