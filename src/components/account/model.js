import _ from 'underscore'
import ATVModel from 'common/model'

class AccountHomeModel extends ATVModel {
  get default() {
    return {
      localStorageID: 'atv-initializeapp',
    }
  }

  get url() {
    return '/currentmembership'
  }

  initialize() {
    console.log('AccountHomeModel initialize')
    const params = {
      CustomerID: this.get('Customer').CustomerID,
    }
    // console.log(this, params, $.param(params))
    this.fetch({
      dataType: 'json',
      ajaxSync: true,
      wait: true,
      data: $.param(params),
      success: this.success,
      error: this.error,
    })
  }

  parse(resp) {
    console.log('AccountHomeModel parse')
    console.log(resp)
    // return resp
  }

  success(model, resp, options) {
    console.log('AccountHomeModel success')
    console.log(model, resp, options)
    // debugger
    model.set({
      currentMembershipSuccess: true,
      currentMembership: resp,
    })
    console.log(model)
  }

  error(model, resp, options) {
    console.log('AccountHomeModel error')
    console.log(model, resp, options)
    // debugger
    let message = ''
    /* eslint function-paren-newline: 0 */
    resp
      .then(
        (response) => {
          console.log(response.responseJSON, response.responseText)
          if (!_.isEmpty(response.responseJSON)) {
            message = response.responseJSON.message
          }
        },
        (error) => {
          console.log(error.responseJSON, error.responseText)
          if (!_.isEmpty(error.responseJSON)) {
            message = error.responseJSON.error
          }
        })
      .always(() => {
        model.set({
          currentMembershipSuccess: false,
          message,
        })
      })
  }
}

export default AccountHomeModel
