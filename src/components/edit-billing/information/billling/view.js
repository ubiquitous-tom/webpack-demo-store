import Backbone, { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import template from './index.hbs'

import EditBillingInformationBillingModel from './model'
// import EditBillingInformationBillingAppliedCode from './applied-code'
import EditBillingInformationBillingAddress from './address'
import EditBillingInformationBillingEmail from './email'
import EditBillingInformationBillingPaymentMethod from './payment-method'
import EditBillingInformationBillingLegal from './legal'
import EditBillingInformationBillingCheckout from './checkout'

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

    this.signInModal = new EditBillingInformationBillingSignInModal({
      model: this.model,
      i18n: this.i18n,
    })
    this.statusModal = new EditBillingInformationBillingStatusModal({
      model: this.model,
      i18n: this.i18n,
    })

    // clear `paymentInfo` on every page change
    // this will prevent using same `Stripe token` issue
    this.model.unset('paymentInfo')

    this.listenTo(this.model, 'editBilling:undelegateEvents', () => {
      console.log('EditBillingInformationBilling garbageCollect')
      this.remove()
      // debugger
    })

    this.listenTo(this.model, 'membership:editBillingSubmitted', () => {
      const isPaymentSuccess = this.statusModal.getData('paymentSuccess')
      // debugger
      if (isPaymentSuccess) {
        Backbone.history.navigate('reviewPurchase', { trigger: true })
        this.model.trigger('editBilling:undelegateEvents')
      }
    })

    this.listenTo(this.model, 'membership:editBillingSignIn', () => {
      // debugger
      Backbone.history.navigate('give', { trigger: true })
      this.model.trigger('editBilling:undelegateEvents')
    })

    this.listenTo(this.model, 'editBillingValidation:stripeCardToken', (paymentInfo) => {
      console.log(paymentInfo)
      // debugger
      if (paymentInfo) {
        const session = {
          Session: {
            SessionID: this.model.get('Session').SessionID,
          },
        }
        const paymentInformation = { ...paymentInfo, ...session }
        // debugger
        this.editBillingInformationBillingModel.set({
          paymentInformation,
        })
        this.displayLoader()
      }
    })

    this.listenTo(this.model, 'editBillingValidation:formError', (error) => {
      console.log(error)
      // debugger
      this.removeLoader()
    })

    this.listenTo(this.editBillingInformationBillingModel, 'change:paymentSuccess', (model, value) => {
      console.log(model, value)
      // Setting up popup state
      this.statusModal.setData('paymentSuccess', value)

      this.editBillingInformationBillingModel.unset('paymentSuccess', { silent: true })
      // debugger
      if (value) {
        this
          .$('#updateBillingAlert')
          .slideUp(400, (e) => {
            console.log(e)
            this
              .$('#updateBillingAlert')
              .remove()
            this.statusModal.render()
            this.statusModal.setBody(this.i18n.t('BILLING-INFO-SUBMITTED'))
          })
        // Backbone.history.navigate('reviewPurchase', { trigger: true })
      } else {
        debugger
        this.removeLoader()
        let errorMessage = model.get('message')
        /* eslint no-lonely-if: 0 */
        if (model.get('message').indexOf('Sign In') >= 0) {
          debugger
          // Backbone.history.navigate('give', { trigger: true })
          // this.$signInStatus.html(errorMessage)
          // this.$signInModal.modal()
          // this.$signInModal.on('hidden.bs.modal', _.bind((e) => {
          //   console.log(e)
          //   Backbone.history.navigate('give', {trigger: true})
          // })
          this.signInModal.render()
          this
            .$('#SignInStatus')
            .html(errorMessage)
        } else {
          //   var billingAddress = xhr.responseJSON.error.BillingAddress
          if (_.isEmpty(errorMessage.BillingAddress)) {
            debugger
            //   if (billingAddress == null) {
            if (errorMessage.indexOf('unable to process this transaction') >= 0) {
              debugger
              errorMessage = this.i18n.t('CREDIT-CARD-NOT-SUPPORTED')
            }
            //     this.$billingStatus.html(errorMessage)
          } else {
            const emptyData = []
            debugger
            const billingAddress = errorMessage.BillingAddress
            // if (!_.isEmpty(billingAddress.Address) && billingAddress.Address == 'Empty') {
            //   emptyData.push('Address')
            // }
            // if (!_.isEmpty(billingAddress.City) && billingAddress.City == 'Empty') {
            //   emptyData.push('City')
            // }
            // if (!_.isEmpty(billingAddress.Name) && billingAddress.Name == 'Empty') {
            //   emptyData.push('Name')
            // }
            // if (!_.isEmpty(billingAddress.State) && billingAddress.State == 'Empty') {
            //   emptyData.push('State/Province')
            // }
            if (!_.isEmpty(billingAddress.Country) && billingAddress.Country === 'Empty') {
              emptyData.push('Country')
            }
            if (!_.isEmpty(billingAddress.Zip) && billingAddress.Zip === 'Empty') {
              emptyData.push('Zip/Postal Code')
            }

            if (_.isEmpty(emptyData)) {
              errorMessage = this.i18n.t('ERR-PROCESS-REQUEST')
            } else {
              emptyData.push(this.i18n.t('ENTER-DATA'))
              errorMessage = `${emptyData.join(', ').trim()}.`
            }
            debugger
            // if (emptyData.length > 0) {
            //   message = this.i18n.t('ENTER-DATA')
            //   for (let i = 0; i < emptyData.length; i++) {
            //     message += emptyData[i] + ', '
            //   }
            //   message = message.substring(0, message.length - 2) + '.'
            // } else {
            //   message = this.i18n.t('ERR-PROCESS-REQUEST')
            // }

            // this.$billingStatus.html(message)
            //   }

            //   this.$billingModal.modal();

            //   }
            // }
          }
          this.statusModal.render()
          this.statusModal.setBody(errorMessage)
        }
        // // Clear Stripe Token field and reset Stripe since we
        // // have problem processing credit card by Stripe.
        // this.paymentMethod.render()
        // this.$('#stripe-token').val('')
      }
    })

    this.listenTo(this.model, 'stripeForm:initialized', () => {
      this
        .$('#savePayment')
        .prop('disabled', false)
    })

    // debugger
    if (this.cart.getTotalQuantity() === 0) {
      if (this.model.get('storeType') === 'Gift') {
        Backbone.history.navigate('give', { trigger: true })
      } else {
        Backbone.history.navigate('membership', { trigger: true })
      }
      this.model.trigger('editBilling:undelegateEvents')
    } else {
      this.render()
    }
  }

  render() {
    console.log('EditBillingInformationBilling render')
    console.log(this.model.attributes)
    // const html = this.template(this.model.attributes)
    // this.$el.html(html)

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

    this.editBillingLegal = new EditBillingInformationBillingLegal({
      model: this.model,
      i18n: this.i18n,
    })

    this.editBillingCheckout = new EditBillingInformationBillingCheckout({
      model: this.model,
      i18n: this.i18n,
    })

    return this
  }

  submit(e) {
    e.preventDefault()
    console.log('EditBillingInformationBilling submit')
    if (this.cart.getTotalQuantity()) {
      this
        .$('.form-trial-signup input')
        .prop('disabled', true)

      this
        .$('.form-trial-signup select')
        .prop('disabled', true)

      this
        .$('#savePayment')
        .prop('disabled', true)

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
      }
      const paymentInfo = this.model.has('paymentInfo')
        ? this.model.get('paymentInfo')
        : defaultPaymentInfo
      // debugger
      this.model.trigger('editBillingValidation:address', paymentInfo)
    }
  }

  membershipAmount() {
    return this.cart.getItemQuantity('monthly')
      ? this.cart.getItemAmount('monthly')
      : this.cart.getItemAmount('annual')
  }

  displayLoader() {
    const loader = `<i class="icon-spinner icon-spin icon-large"></i> ${this.i18n.t('SUBMITTING')}`
    const modal = $('<div>')
      .attr({ id: 'updateBillingAlert' })
      .addClass('alert alert-info')
      .css({ display: 'none' })
      .html(loader)

    this
      .$('.form-trial-signup')
      .after(modal)

    this
      .$('#updateBillingAlert')
      .slideDown(400, () => {
        // debugger
        this.editBillingInformationBillingModel.submit()
      })
  }

  removeLoader() {
    this
      .$('#updateBillingAlert')
      .slideUp()
      .remove()

    this
      .$('.form-trial-signup input')
      .prop('disabled', false)

    this
      .$('.form-trial-signup select')
      .prop('disabled', false)

    this
      .$('#savePayment')
      .prop('disabled', false)
  }
}

export default EditBillingInformationBilling
