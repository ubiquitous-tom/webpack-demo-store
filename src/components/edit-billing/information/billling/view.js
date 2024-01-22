import Backbone, { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

import EditBillingInformationBillingModel from './model'
import EditBillingInformationBillingAppliedCode from './applied-code'
import EditBillingInformationBillingAddress from './address'
import EditBillingInformationBillingEmail from './email'
import EditBillingInformationBillingPaymentMethod from './payment-method'

class EditBillingInformationBilling extends View {
  get el() {
    return '#edit-billing-information'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'submit .form-trial-signup': 'submit',
    }
  }

  initialize() {
    console.log('EditBillingInformationBilling initialize')
    this.cart = this.model.get('cart')

    this.editBillingInformationBillingModel = new EditBillingInformationBillingModel()

    this.listenTo(this.model, 'editBillingValidation:submit', (model, context) => {
      console.log(model, context)
      debugger
      context.model.trigger('editBillingValidation:address', model, context)
    })

    this.listenTo(this.model, 'editBillingValidation:stripeCardInfo', (value) => {
      console.log(value)
      debugger
      if (value) {
        // {
        //   "Session": {
        //     "SessionID": "4739a38e-a897-4665-a19c-15609c89f4bc"
        //   },
        //   "BillingAddress": {
        //     "Name": "Tom Test23",
        //     "Country": "US",
        //     "Zip": "90066"
        //   },
        //   // "Customer": {
        //   //   "Email": "toms23@test.com",
        //   //   "MarketingOptIn": "1",
        //   // },
        //   // "Credentials": {
        //   //   "Password": "tomtom",
        //   // },
        //   "PaymentMethod": {
        //     "NameOnAccount": "Tom Test",
        //     "StripeToken": "tok_1ObAtP2hcBjtiCUZldDfXCkN"
        //   },
        //   "Ammount": "6.99"
        // }
        const paymentInfo = this.model.get('paymentInfo')
        const session = {
          Session: this.model.get('Session').SessinID,
          Ammount: this.membershipAmount(),
        }
        _.extend(paymentInfo, session)
        debugger
        this.model.set(paymentInfo)
        debugger
        this.editBillingInformationBillingModel.submit(paymentInfo)
      }
    })

    this.listenTo(this.editBillingInformationBillingModel, 'change:paymentSuccess', (model, value) => {
      console.log(model, value)
      debugger
      if (value) {
        Backbone.history.navigate('reviewPurchase')
      } else {
        // if (model.get('message').indexOf('Sign In') >= 0) {
        //   this.modal.render()

        //   this.$signInStatus.html(errorMessage)

        //   this.$signInModal.modal()
        //   this.$signInModal.on('hidden.bs.modal', _.bind(function () {
        //     Backbone.trigger('navChange', 'give')
        //   }, this))
        // } else {
        //   var billingAddress = xhr.responseJSON.error.BillingAddress
        //   if (billingAddress == null) {
        //     if (errorMessage.indexOf('unable to process this transaction') >= 0) {
        //       errorMessage = polyglot.t("CREDIT-CARD-NOT-SUPPORTED")
        //     }
        //     this.$billingStatus.html(errorMessage)
        //   } else {
        //     var emptyData = []
        //     // if (billingAddress.Address != null && billingAddress.Address == "Empty") {
        //     //   emptyData.push("Address")
        //     // }
        //     // if (billingAddress.City != null && billingAddress.City == "Empty") {
        //     //   emptyData.push("City")
        //     // }
        //     // if (billingAddress.Name != null && billingAddress.Name == "Empty") {
        //     //   emptyData.push("Name")
        //     // }
        //     // if (billingAddress.State != null && billingAddress.State == "Empty") {
        //     //   emptyData.push("State/Province")
        //     // }
        //     if (billingAddress.Country != null && billingAddress.Country == 'Empty') {
        //       emptyData.push('Country')
        //     }
        //     if (billingAddress.Zip != null && billingAddress.Zip == "Empty") {
        //       emptyData.push("Zip/Postal Code")
        //     }

        //     var message
        //     if (emptyData.length > 0) {
        //       message = polyglot.t("ENTER-DATA")
        //       for (var i = 0 i < emptyData.length i++) {
        //         message += emptyData[i] + ", "
        //       }
        //       message = message.substring(0, message.length - 2) + "."
        //     } else {
        //       message = polyglot.t("ERR-PROCESS-REQUEST")
        //     }

        //     this.$billingStatus.html(message)

        //     // this.paymentMethod.render()
        //     // this.$('#stripe-token').val('')
        this.$el.find('#savePayment').prop('disabled', false)
        //   }
        // }
      }
    })

    if (this.cart.getTotalQuantity() === 0) {
      if (this.model.get('Session').LoggedIn) {
        Backbone.history.navigate('membership', { trigger: true })
      } else {
        Backbone.history.navigate('give', { trigger: true })
      }
    }

    this.render()
  }

  render() {
    console.log('EditBillingInformationBilling render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.html(html)

    this.editBillingAppliedCode = new EditBillingInformationBillingAppliedCode({
      model: this.model,
      i18n: this.i18n,
    })

    this.editBillingAddress = new EditBillingInformationBillingAddress({
      model: this.model,
      i18n: this.i18n,
    })

    this.editBillingEmail = new EditBillingInformationBillingEmail({
      model: this.model,
      i18n: this.i18n,
    })

    this.editBillingPaymentMethod = new EditBillingInformationBillingPaymentMethod({
      model: this.model,
      i18n: this.i18n,
    })

    return this
  }

  submit(e) {
    e.preventDefault()
    console.log('EditBillingInformationBilling submit')
    if (this.cart.getTotalQuantity()) {
      // this.$el.find('#savePayment').prop('disabled', true)
      this.model.trigger('editBillingValidation:submit', this.model, this)
    }
  }

  membershipAmount() {
    return this.cart.getItemQuantity('monthly')
      ? this.cart.getItemAmount('monthly')
      : this.cart.getItemAmount('annual')
  }
}

export default EditBillingInformationBilling
