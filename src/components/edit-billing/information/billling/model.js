import { Model } from 'backbone'

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
  //     Ammount: '6.99',
  //   }
  // }

  get url() {
    return '/paymemt'
  }

  initialize() {
    console.log('EditBillingInformationBillingModel initialize')
  }

  submit(data) {
    console.log('EditBillingInformationBillingModel submit')
    console.log(this)
    const {
      sessionID,
      name,
      country,
      billingzip,
      nameoncard,
      stripeToken,
      amount,
    } = data

    const attributes = {
      Session: {
        SessionID: sessionID,
      },
      BillingAddress: {
        Name: name,
        Country: country,
        Zip: billingzip,
      },
      PaymentMethod: {
        NameOnAccount: nameoncard,
        StripeToken: stripeToken,
      },
      Ammount: amount,
    }

    const options = {
      dataType: 'json',
      ajaxSync: true,
      wait: true,
      success: this.success,
      error: this.error,
    }
    console.log(attributes, options)
    this.save(attributes, options)
  }

  success(model, resp, options) {
    console.log('EditBillingInformationBillingModel success')
    console.log(model, resp, options)

    const { message } = resp // Your Promotion Code has been applied!
    model.set({
      applyPromoCodeSuccess: true,
      type: 'success',
      message,
    })
  }

  error(model, resp, options) {
    console.log('EditBillingInformationBillingModel error')
    console.log(model, resp, options)
    /* eslint function-paren-newline: 0 */
    resp
      .then(
        (response) => {
          console.log(response.responseJSON)
          if (!_.isEmpty(response.responseJSON)) {
            model.set({
              applyPromoCodeSuccess: false,
              type: 'error',
              message: response.responseJSON.message,
            })
          }
        },
        (error) => {
          console.log(error.responseJSON)
          if (!_.isEmpty(error.responseJSON)) {
            model.set({
              applyPromoCodeSuccess: false,
              type: 'error',
              message: error.responseJSON.error,
            })
          }
        })
  }
}

export default EditBillingInformationBillingModel
