import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import template from './index.hbs'

class UpdateCard extends View {
  get el() {
    return '#account'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click button.go-to-membership': 'goToMembership',
    }
  }

  initialize() {
    console.log('UpdateCard initialize')
    console.log(this.model)

    this.render()
  }

  render() {
    console.log('UpdateCard render')
    const ckey = '1742pkulzsyysulfkngkfulcd'
    const stripeCustomerID = this.model.get('Customer').StripeCustomerID
    const data = {
      src: `https://payments.stunning.co/payment_update/${ckey}/${stripeCustomerID}`,
    }
    const html = this.template(data)
    this.$el.append(html)

    this.hideFooter()

    _.delay(this.goBack, 3000, this)

    return this
  }

  goBack(context) {
    context.$el.find('button.go-to-membership').removeClass('hidden')
  }

  goToMembership(e) {
    console.log('UpdateCard goToMembership')
    e.preventDefault()
    this.$el.find('#stunning').remove()
    this.showFooter()
    window.location.assign('#accountStatus')
    window.location.reload()
  }

  showFooter() {
    $('footer').show()
  }

  hideFooter() {
    $('footer').hide()
  }
}

export default UpdateCard
