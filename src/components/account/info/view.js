import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import template from './temp-new.html'
import Handlebars from 'handlebars'
import AccountInfoModel from './model'

class AccountInfo extends View {

  get el() {
    return 'section'
  }

  get template() {
    // return template
    return _.template(template)
  }

  get events() {
    return {
      'click .cancel-membership a': 'cancelMembership',
    }
  }

  initialize() {
    console.log('AccountInfo initialize')
    // console.log(this.model.attributes)
    this.model = new AccountInfoModel(this.model.attributes)
    this.render()
    // this.listenTo(this.model, 'sync', this.render)
  }

  render() {
    console.log('AccountInfo render')
    // console.log(this.model.attributes)
    // console.log(this.options.model)
    // this.options.model.set('currentMembership', this.model.get('currentMembership'))
    // console.log(this.$el[0])
    const template = Handlebars.compile(this.template())
    // console.log(this.model.attributes)
    const html = template(this.model.attributes)
    // console.log(html)
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
    const env = window.location.hostname.indexOf('dev') > -1
      ? 'dev3.'
      : window.location.hostname.indexOf('qa') > -1
        ? 'qa.'
        : ''
    // console.log(env)
    return 'dev3.' //env
  }
}

export default AccountInfo
