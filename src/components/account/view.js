import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.css'
import template from './temp-new.html'

import AccountHomeModel from './model'
import AccountStatus from './status'
import AccountInfo from './info'
import BillingInfo from './billing'
import Dispatcher from 'common/dispatcher'

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

  initialize(options) {
    console.log('AccountHome initialize')
    console.log(this.model.attributes)
    this.dispatcher = options.dispatcher
    this.model = new AccountHomeModel(this.model.attributes)
    // console.log(this.model)
    // this.render()
    this.listenTo(this.model, 'sync', this.render)
    // this.listenTo(this.model, 'change', this.render)
  }

  render() {
    console.log('AccountHome render')
    // console.log(this.$el[0])
    this.$el.html(this.template())

    // Initialize late in order for all the element to be added to the main dom
    this.accountStatus = new AccountStatus({ model: this.model, dispatcher: this.dispatcher })
    this.accountInfo = new AccountInfo({ model: this.model, dispatcher: this.dispatcher })
    this.billingInfo = new BillingInfo({ model: this.model, dispatcher: this.dispatcher })

    return this
  }
}

export default AccountHome
