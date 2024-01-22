import { Model } from 'backbone'
import _ from 'underscore'

class CSRFAuthorization extends Model {
  get url() {
    return '/api/user/csrfPreAuth'
  }

  initialize(options) {
    console.log('CSRFAuthorization initialize')
    console.log(options)
    this.model = new Model()
    this.customerID = options.model.get('Customer').CustomerID
    this.csrfToken = $('meta[name="csrf-token"]').attr('content')
    console.log(this.customerID, this.csrfToken)

    /* eslint-disable no-shadow */
    this.model.on('change:setPreAuthSuccess', (model, value, options) => {
      console.log(model, value, options)
      // debugger
      this.model.set('setCSRFAuthorizationSuccess', value)
    })
  }

  setPreAuth() {
    const csrfPreAuth = new Model()
    const { customerID, csrfToken } = this
    const headers = {
      'csrf-token': csrfToken,
      Accept: 'application/json',
    }
    const attributes = {
      key: `csrf-${customerID}`,
      value: csrfToken,
    }

    const options = {
      url: this.url,
      context: this,
      headers,
      dataType: 'html',
      ajaxSync: true,
      wait: true,
      success: this.success,
      error: this.error,
    }

    console.log(attributes, options)
    csrfPreAuth.save(attributes, options)
  }

  parse(resp) {
    console.log('CSRFAuthorization parse')
    console.log(resp)
    // return resp
  }

  success(model, resp, options) {
    console.log('CSRFAuthorization success')
    console.log(model, resp, options)
    // debugger
    this.model.set({
      setPreAuthSuccess: true,
      // setPreAuth: resp,
      csrfToken: options.context.csrfToken,
    })
    console.log(model)
  }

  error(model, resp, options) {
    console.log('CSRFAuthorization error')
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
          setPreAuthSuccess: false,
          message,
        })
      })
  }

  // setPreAuth() {
  //   $ajax({
  //     method: 'POST',
  //     url: '/api/user/csrfPreAuth',
  //     data: JSON.stringify({
  //       key: 'csrf-' + customerID,
  //       value: csrfToken,
  //     }),
  //     contentType: 'application/json; charset=utf-8',
  //     dataType: 'json',
  //     headers: {
  //       'csrf-token': csrfToken,
  //       'Accept': 'application/json'
  //     },
  //   })
  //     .then(function (resp) {
  //       console.log(resp);
  //       if (callback) {
  //         return callback(resp)
  //       }
  //     }, function (err) {
  //       console.log(err);
  //     });

  //   return deferred.promise;
  // }
}

export default CSRFAuthorization
