import { Model } from 'backbone'

class PaymentEstimation extends Model {
  urlRoot() {
    const env = this.environment()
    return `https://${env}api.rlje.net/acorn/payment/estimate`
  }

  initialize() {
    console.log('PaymentEstimation initialize')

    // API response
    //
    // {
    //   "Code": "3e2aff6c-9e01-4219-a3df-aada374ef81f",
    //   "Date": 1705968000000,
    //   "Status": "Saved",
    //   "Type": "SalesInvoice",
    //   "CurrencyCode": "USD",
    //   "CustomerCode": "TaxEstimatorPOC",
    //   "TotalAmount": 7.99,
    //   "TotalExempt": 7.99,
    //   "TotalDiscount": 0.0,
    //   "TotalTaxCalculated": 0.0,
    //   "ExchangeRate": 1.0
    // }
  }

  getPaymentEstimation(attributes) {
    console.log('PaymentEstimation getPaymentEstimation')
    // const attributes = {
    //   Country: params.billingAddress.Country,
    //   PostalCode: params.billingAddress.PostalCode,
    //   Amount: params.Amount,
    // }

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
    console.log('PaymentEstimation success')
    console.log(model, resp, options)
    // debugger
    const { message } = resp
    model.set({
      paymentEstimationSuccess: true,
      type: 'success',
      message,
    })
  }

  error(model, resp, options) {
    console.log('PaymentEstimation error')
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
          paymentEstimationSuccess: false,
          message,
        })
      })
  }

  environment() {
    let env = ''
    if (window.location.hostname.indexOf('dev') > -1) {
      env = 'dev3-'
    }
    if (window.location.hostname.indexOf('qa') > -1) {
      env = 'qa-'
    }
    if (process.env.NODE_ENV === 'development') {
      env = process.env.RLJE_API_ENVIRONMENT
    }
    // console.log(env)
    return env
  }
}

export default PaymentEstimation
