import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.css'
import template from './temp-new.html'
import Handlebars from 'handlebars'
import AccountInfoModel from './model'

class AccountInfo extends View {

  get template() {
    // return template
    return _.template(template)
  }

  initialize() {
    console.log('AccountInfo initialize')
    this.model = new AccountInfoModel()
    // this.render()
  }

  render() {
    console.log('AccountInfo render')
    // console.log(this.model.attributes)

    const template = Handlebars.compile(this.template())
    const html = template(this.model.attributes)
    // console.log(html)
    this.$el.html(html)
  }
}

export default AccountInfo
