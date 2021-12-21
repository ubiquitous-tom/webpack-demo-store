import { Model } from 'backbone'
import StripeKey from 'common/models/stripe-key'

class StripeFormModel extends Model {
  initialize() {
    console.log('StripeFormModel initialize')
    this.stripeKey = new StripeKey()
    // console.log(this.stripeKey)

    this.stripeKey.on('change:StripeKey', (model, value) => {
      // console.log(model, value)
      // debugger
      this.set('stripeKey', value)
    })
  }
}

export default StripeFormModel
