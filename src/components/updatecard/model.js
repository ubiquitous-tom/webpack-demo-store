// import _ from 'underscore'
// import PlansChange from 'core/models/plans-change'
import ATVModel from 'core/model'

class UpdateCardModel extends ATVModel {
  get default() {
    return {
      localStorageID: 'atv-initializeapp',
    }
  }

  get url() {
    return '/currentmembership'
  }

  initialize() {
    console.log('UpdateCardModel initialize')
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
    console.log('UpdateCardModel parse')
    console.log(resp)
    // return resp
  }

  success(model, resp, options) {
    console.log('UpdateCardModel success')
    console.log(model, resp, options)
    // debugger
    model.set({
      currentMembershipSuccess: true,
      currentMembership: resp,
    })
    console.log(model)
  }

  error(model, resp, options) {
    console.log('UpdateCardModel error')
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
            return message
          }
          if (!_.isEmpty(response.responseText)) {
            message = response.responseText
            return message
          }
          return message
        },
        (error) => {
          console.log(error.responseJSON, error.responseText)
          if (!_.isEmpty(error.responseJSON)) {
            message = error.responseJSON.error
            return message
          }
          if (!_.isEmpty(error.responseText)) {
            message = error.responseText
            return message
          }
          return message
        })
      .always(() => {
        model.set({
          currentMembershipSuccess: false,
          message,
        })
      })
  }

  loadingStart() {
    console.log('UpdateCardModel loadingStart')
  }

  loadingStop() {
    console.log('UpdateCardModel loadingStop')
  }
}

export default UpdateCardModel
