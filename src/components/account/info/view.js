import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class AccountInfo extends View {
  get el() {
    return 'section'
  }

  get template() {
    return template
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
    window.location.assign(cancelMembershipURL)
  }

  environment() {
    let env = window.location.hostname.indexOf('dev') > -1 ? 'dev3.' : ''
    env = window.location.hostname.indexOf('qa') > -1 ? 'qa.' : ''
    // console.log(env)
    env = 'dev3.'
    return env
  }
}

export default AccountInfo
