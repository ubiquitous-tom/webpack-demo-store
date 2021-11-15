import { View } from 'backbone'
import _ from 'underscore'
// import '@stripe/stripe-js'
// import { loadStripe } from '@stripe/stripe-js'
import Dispatcher from '../../common/dispatcher'

import './stylesheet.css'
import template from './index.html'

class StripeForm extends View {

  get el() {
    return '#account'
  }

  get template() {
    return _.template(template)
  }

  get events() {
    return {
      'click #stripe-form button[type="reset"]': 'reset',
      'click #stripe-form button[type="submit"]': 'submit',
    }
  }

  initialize(options) {
    console.log('StripeForm initialize')
    this.dispatcher = new Dispatcher()
    console.log(this)
    console.log(options)
    this.parentView = options.parentView
    console.log(this.parentView)
    // console.log(Stripe)

    const elementStyles = {
      base: {
        iconColor: '#dddddd',
        color: '#464646',
        fontFamily: 'futura-pt, sans-serif',
        fontWeight: 300,
        // lineHeight: '2.25rem',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        // padding: '10px',
        // height: '31px',
        '::placeholder': {
          // padding: '20px',
          color: '#999',
        },
      },
      complete: {
        iconColor: '#3c763d',
        color: '#3c763d',
      },
      invalid: {
        iconColor: '#a94442',
        color: '#a94442',
        fontWeight: 400,
        // border: '#a94442',
      },
    }

    // this.stripe = loadStripe('pk_live_Riw8CYEIjVsr54nzgGIOvzKL')
    this.stripe = Stripe('pk_test_lJqmZftGTxLatArjHLxHumTC')

    console.log(this.stripe)
    this.elements = this.stripe.elements({
      locale: 'auto',
      fonts: [
        // {
        //   family: 'futura-pt',
        //   weight: 400,
        //   // src: 'local("Open Sans"), local("OpenSans"), url(https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3ZBw1xU1rKptJj_0jans920.woff2) format("woff2")',
        //   unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215'
        // }
        {
          cssSrc: 'https://use.typekit.net/how3tbq.css',
        }
      ]
    })

    this.cardNumber = this.elements.create('cardNumber', {
      style: elementStyles
    })

    this.cardExpiry = this.elements.create('cardExpiry', {
      style: elementStyles
    })

    this.cardCvc = this.elements.create('cardCvc', {
      style: elementStyles
    })
    // this.cardCvc.on('change', (f, a) => {
    //   console.log(f, a)
    //   console.log(f.value)
    // })

    // console.log(this)
  }

  render() {
    console.log('StripeForm render')
    // console.log(this.$el[0])
    // console.log(this.$el.find('#stripe-form')[0])
    // console.log(this.$el.find('.switch-to-annual-plan-container')[0])
    // console.log(this.template())
    // this.setElement('#stripe-form')
    // this.setElement('.switch-to-annual-plan-container')
    const template = this.template()

    this.$el.find('#stripe-form').html(template)

    this.cardNumber.mount("#card-number")
    this.cardExpiry.mount("#card-expiry")
    this.cardCvc.mount("#card-cvc")
    console.log(this)

    return this
  }

  reset(e) {
    console.log('StripeForm reset')
    this.$el.find('#stripe-form').empty()
    this.parentView.render()
  }

  submit(e) {
    console.log('StripeForm submit')
    console.log(e, $(e.currentTarget))
    // console.log(this.stripe, this.elements)
    // console.log(this.cardNumber)
    // console.log(this.cardExpiry)
    // console.log(this.cardCvc)
    // console.log(this.$el.find('#stripe-form #nameoncard').val())
    // console.log(this.$el.find('#stripe-form #card-zipcode').val())
    // console.log(this.parentView.model.model.get('BillingAddress'))
    // console.log(this.cardCvc.on)
    // this.parentView.updateCard()
    console.log(this.parentView.model)
    const data = {
      name: this.$el.find('#stripe-form #nameoncard').val(),
      address_zip: this.$el.find('#stripe-form #card-zipcode').val(),
      address_country: this.parentView.model.get('country'),
    }
    this.stripe.createToken(this.cardNumber, data)
      .then((result) => {
        if (result.token) {
          const stripeCustomerID = result.token.id
          const updatedStripCard = _.extend(data, { token: stripeCustomerID })
          console.log(updatedStripCard)
          this.parentView.model.set('newStripeCardInfo', updatedStripCard)
          console.log(this, this.parentView)
          this.$el.find('#stripe-form').empty()
          this.parentView.render()
        }
      })
  }

  disableInputs() {
    this.$el.find('input').setAttribute('disabled', true)
  }

  enableInputs() {
    this.$el.find('input').setAttribute('disabled', false)
  }
}

export default StripeForm
