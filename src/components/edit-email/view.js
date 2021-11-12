import { View } from 'backbone'
import _ from 'underscore'

import template from './temp.html'
import EditEmailModel from './model'

class EditEmail extends View {

  get el() {
    return 'section'
  }

  get template() {
    return _.template(template)
  }

  get events() {
    return {
      'change #Email': 'validateEmail',
      'change #ConfirmEmail': 'validateConfirmEmail',
      'submit #changeEmailForm': 'changeEmail'
    }
  }

  initialize() {
    console.log('EditEmail initialize')
    this.model = new EditEmailModel()
    this.render()
  }

  render() {
    console.log('EditEmail render')
    this.$el.html(this.template())

    return this
  }

  changeEmail(e) {
    e.preventDefault()
    console.log('EditEmail changeEmail')
    // const params = $(e.currentTarget).serialize()
    const params = $(e.currentTarget).serializeArray()
    console.log(params)
    this.model.changeEmail(params)
  }
}

export default EditEmail
