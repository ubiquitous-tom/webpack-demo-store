import { View } from 'backbone'
import _ from 'underscore'

import template from './temp.html'
import EditPasswordModel from './model'

class EditPassword extends View {

  get el() {
    return 'section'
  }

  get template() {
    return _.template(template)
  }

  get events() {
    return {
      'input #Password': 'validatePassword',
      'input #ConfirmPassword': 'validateConfirmPassword',
      'submit #changePasswordForm': 'changePassword'
    }
  }

  initialize() {
    console.log('EditPassword initialize')
    this.model = new EditPasswordModel()
    this.render()
  }

  render() {
    console.log('EditPassword render')
    this.$el.html(this.template())

    return this
  }

  changePassword(e) {
    e.preventDefault()
    console.log('EditPassword changePassword')
    // const params = $(e.currentTarget).serialize()
    const params = $(e.currentTarget).serializeArray()
    console.log(params)
    this.model.changePassword(params)
  }
}

export default EditPassword
