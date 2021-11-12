import { View } from 'backbone'
import _ from 'underscore'

import template from './temp.html'
import ApplyPromoCodeModel from './model'

class ApplyPromoCode extends View {

  get el() {
    return 'section'
  }

  get template() {
    return _.template(template)
  }

  get events() {
    return {
      // 'input #EnterPromoCode': 'validatePromoCode',
      'input #EnterPromoCode': 'toUpperCase',
      'submit #applyCodeForm': 'applyCode'
    }
  }

  initialize() {
    console.log('ApplyPromoCode initialize')
    this.model = new ApplyPromoCodeModel()
    this.render()
  }

  render() {
    console.log('ApplyPromoCode render')
    this.$el.html(this.template())

    return this
  }

  toUpperCase(e) {
    // console.log(e)
    let input = e.target.value.toUpperCase()
    // console.log(input)
    // console.log(this.$el.find(e.currentTarget)[0])
    this.$el.find(e.currentTarget).val(input)
  }

  applyCode(e) {
    e.preventDefault()
    console.log('ApplyPromoCode applyCode')
    const code = e.target[0].value
    // const code = this.$el.find('#EnterPromoCode').val()
    this.model.applyCode(code)
  }
}

export default ApplyPromoCode
