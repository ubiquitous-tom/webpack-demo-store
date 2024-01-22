import ATVModel from 'core/model'

class EditBillingInformationBillingPaymentMethodModel extends ATVModel {
  get url() {
    return '/stripekey'
  }

  initialize() {
    console.log('EditBillingInformationBillingPaymentMethodModel initialize')
    this.fetch({
      ajaxSync: true,
    })
  }

  parse(response) {
    console.log('InitializeApp parse')
    console.log(response)
    const data = response
    if (_.isEmpty(data)) {
      return data
    }

    return data
  }
}

export default EditBillingInformationBillingPaymentMethodModel
