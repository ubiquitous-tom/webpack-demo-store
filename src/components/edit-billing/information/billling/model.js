import { Model } from 'backbone'
import _ from 'underscore'

class EditBillingInformationBillingModel extends Model {
  // get defaults() {
  //   return {
  //     Session: {
  //       SessionID: '4739a38e-a897-4665-a19c-15609c89f4bc',
  //     },
  //     BillingAddress: {
  //       Name: 'Tom Test23',
  //       Country: 'US',
  //       Zip: '90066',
  //     },
  //     PaymentMethod: {
  //       NameOnAccount: 'Tom Test',
  //       StripeToken: 'tok_1ObAtP2hcBjtiCUZldDfXCkN',
  //     },
  //   }
  // }

  get url() {
    return '/payment'
  }

  initialize() {
    console.log('EditBillingInformationBillingModel initialize')
    // if the customer is not logged in
    //
    // {
    //   "Session": {
    //     "SessionID": "4739a38e-a897-4665-a19c-15609c89f4bc"
    //   },
    //   "BillingAddress": {
    //     "Name": "Tom Test23",
    //     "Country": "US",
    //     "Zip": "90066"
    //   },
    //   "Customer": {
    //     "Email": "toms23@test.com",
    //     "MarketingOptIn": "1",
    //   },
    //   "Credentials": {
    //     "Password": "tomtom",
    //   },
    //   "PaymentMethod": {
    //     "NameOnAccount": "Tom Test",
    //     "StripeToken": "tok_1ObAtP2hcBjtiCUZldDfXCkN"
    //   },
    // }
  }

  submit() {
    console.log('EditBillingInformationBillingModel submit')
    console.log(this)

    const attributes = this.get('paymentInformation')
    debugger
    const options = {
      dataType: 'json',
      ajaxSync: true,
      wait: true,
      success: this.success,
      error: this.error,
    }
    console.log(attributes, options)
    debugger
    this.save(attributes, options)
  }

  success(model, resp, options) {
    console.log('EditBillingInformationBillingModel success')
    console.log(model, resp, options)
    // debugger
    const { message } = resp // Your Promotion Code has been applied!
    model.set({
      paymentSuccess: true,
      type: 'success',
      message,
    })
  }

  error(model, resp, options) {
    console.log('EditBillingInformationBillingModel error')
    console.log(model, resp, options)
    let message = 'ERR-PROCESS-REQUEST'
    // debugger
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
          paymentSuccess: false,
          message,
        })
      })
  }
}

export default EditBillingInformationBillingModel
