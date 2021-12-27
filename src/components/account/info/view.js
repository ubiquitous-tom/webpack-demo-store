import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'
import reducedTemplate from './reduced.hbs'

class AccountInfo extends View {
  get el() {
    return 'section'
  }

  get template() {
    return this.getMembershipType()
  }

  get events() {
    return {
      'click .cancel-membership a': 'cancelMembership',
    }
  }

  initialize() {
    console.log('AccountInfo initialize')
    this.render()
  }

  render() {
    console.log('AccountInfo render')
    const html = this.template(this.model.attributes)
    this.$el.find('#accountInfoView').html(html)

    return this
  }

  cancelMembership(e) {
    console.log('AccountInfo cancelMembership')
    e.preventDefault()
    const env = this.environment()
    const cancelMembershipURL = `https://${env}acorn.tv/account/cancel`
    console.log(cancelMembershipURL)
    // window.location.assign(cancelMembershipURL)
  }

  getMembershipType() {
    if (this.model.get('Subscription').NoSubscription || this.model.get('Subscription').Canceled) {
      return reducedTemplate
    }

    return template
  }

  environment() {
    let env = window.location.hostname.indexOf('dev') > -1 ? 'dev3.' : ''
    env = window.location.hostname.indexOf('qa') > -1 ? 'qa.' : ''
    env = (process.env.NODE_ENV === 'development') ? process.env.ENVIRONMENT : env
    console.log(env)
    return env
  }
}

export default AccountInfo
