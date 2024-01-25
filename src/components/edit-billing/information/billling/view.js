import Backbone, { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

import EditBillingInformationBillingModel from './model'
// import EditBillingInformationBillingAppliedCode from './applied-code'
import EditBillingInformationBillingAddress from './address'
import EditBillingInformationBillingEmail from './email'
import EditBillingInformationBillingPaymentMethod from './payment-method'

import EditBillingInformationBillingSignInModal from './partials/modals/sign-in'
import EditBillingInformationBillingStatusModal from './partials/modals/status'

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

  initialize(options) {
    console.log('EditBillingInformationBilling initialize')
    this.i18n = options.i18n
    this.cart = this.model.get('cart')

    this.editBillingInformationBillingModel = new EditBillingInformationBillingModel()

    this.signInModal = new EditBillingInformationBillingSignInModal()
    this.statusModal = new EditBillingInformationBillingStatusModal()

    // clear `paymentInfo` on every page change
    // this will prevent using same `Stripe token` issue
    this.model.unset('paymentInfo')

    this.listenToOnce(this.model, 'editBillingValidation:stripeCardToken', (paymentInfo, context) => {
      console.log(paymentInfo, context)
      debugger
      if (paymentInfo) {
        // this.model.get('paymentInfo')
        const session = {
          Session: {
            SessionID: this.model.get('Session').SessionID,
          },
        }
        // WEIRD TYPO HERE `Ammount` 2 m's, for some reasons...
        const amount = {
          Ammount: this.membershipAmount(),
        }
        const paymentInformation = { ...paymentInfo, ...session, ...amount }
        // debugger
        // context.model.set({
        //   paymentInfo,
        // })
        debugger
        this.editBillingInformationBillingModel.submit(paymentInformation)
      }
    })

    this.listenToOnce(this.editBillingInformationBillingModel, 'change:paymentSuccess', (model, value) => {
      console.log(model, value)
      // debugger
      if (value) {
        Backbone.history.navigate('reviewPurchase', { trigger: true })
      } else {
        /* eslint no-lonely-if: 0 */
        if (model.get('message').indexOf('Sign In') >= 0) {
          Backbone.history.navigate('give', { trigger: true })
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
          //   }

          //   this.$billingModal.modal();

          //      // Clear Stripe Token field and reset Stripe since we
          //      // have problem processing credit card by Stripe.
          //     this.paymentMethod.render()
          //     this.$('#stripe-token').val('')
          //   }
          // }
        }

        this.$el
          .find('#savePayment')
          .prop('disabled', false)
      }
    })

    this.listenTo(this.model, 'stripeForm:initialized', () => {
      this.$el.find('#savePayment').prop('disabled', false)
    })

    // debugger
    if (this.cart.getTotalQuantity() === 0) {
      if (this.model.get('storeType') === 'Gift') {
        Backbone.history.navigate('give', { trigger: true })
      } else {
        Backbone.history.navigate('membership', { trigger: true })
      }
    } else {
      this.render()
    }
  }

  render() {
    console.log('EditBillingInformationBilling render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.html(html)

    // this.editBillingAppliedCode = new EditBillingInformationBillingAppliedCode({
    //   model: this.model,
    //   i18n: this.i18n,
    // })

    this.editBillingAddress = new EditBillingInformationBillingAddress({
      model: this.model,
      i18n: this.i18n,
    })

    const isLoggedIn = (this.model.has('Session') ? this.model.get('Session').LoggedIn : false)
    if (!isLoggedIn) {
      this.editBillingInformationBillingEmail = new EditBillingInformationBillingEmail({
        model: this.model,
        i18n: this.i18n,
      })
    }

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
      this.$el.find('#savePayment').prop('disabled', true)

      // start form validation process
      const defaultPaymentInfo = {
        Session: {
          SessionID: '',
        },
        BillingAddress: {
          Name: '',
          Country: '',
          Zip: '',
        },
        PaymentMethod: {
          NameOnAccount: '',
          StripeToken: '',
        },
        Ammount: '',
      }
      const paymentInfo = this.model.has('paymentInfo')
        ? this.model.get('paymentInfo')
        : defaultPaymentInfo
      // this.model.set({
      //   paymentInfo,
      // })
      // debugger
      // this.model.get('paymentInfo')
      // this.model.trigger('editBillingValidation:submit', this.model, this)
      // this.model.trigger('editBillingValidation:address', this.model, this)
      this.model.trigger('editBillingValidation:address', paymentInfo, this)
    }
  }

  membershipAmount() {
    return this.cart.getItemQuantity('monthly')
      ? this.cart.getItemAmount('monthly')
      : this.cart.getItemAmount('annual')
  }
}

export default EditBillingInformationBilling