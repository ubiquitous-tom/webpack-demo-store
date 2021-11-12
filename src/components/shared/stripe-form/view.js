import { View } from 'backbone'
import _ from 'underscore'
// import '@stripe/stripe-js'
// import { loadStripe } from '@stripe/stripe-js'

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
      'click button[type="reset"]': 'reset',
      'click button[type="submit"]': 'submit',
    }
  }

  initialize(options) {
    console.log('StripeForm initialize')
    console.log(this, options)
    this.parentView = options.parent
    console.log(this)
    // console.log(Stripe)

    const elementStyles = {
      base: {
        iconColor: '#dddddd',
        color: '#464646',
        fontFamily: 'futura-pt, sans-serif',
        fontWeight: 300,
        lineHeight: '2.25rem',
        fontSize: '1rem',
        fontSmoothing: 'antialiased',
        padding: '10px',
        '::placeholder': {
          padding: '20px',
          color: '#999',
        },
      },
      // complete: {
      //   iconColor: '#3c763d',
      //   color: '#3c763d',
      // },
      invalid: {
        iconColor: '#a94442',
        color: '#a94442',
        fontWeight: 400,
      },
    }

    // this.stripe = loadStripe('pk_live_Riw8CYEIjVsr54nzgGIOvzKL')
    this.stripe = Stripe('pk_live_Riw8CYEIjVsr54nzgGIOvzKL')

    console.log(this.stripe)
    this.elements = this.stripe.elements({
      locale: 'auto',
      fonts: [{
        family: 'futura-pt',
        weight: 400,
        // src: 'local("Open Sans"), local("OpenSans"), url(https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3ZBw1xU1rKptJj_0jans920.woff2) format("woff2")',
        unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215'
      }]
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

    // console.log(this)
  }

  render() {
    console.log('StripeForm render')
    console.log(this.$el[0])
    console.log(this.$el.find('#stripe-form')[0])
    // console.log(this.$el.find('.switch-to-annual-plan-container')[0])
    console.log(this.template())
    // this.setElement('#stripe-form')
    // this.setElement('.switch-to-annual-plan-container')
    const template = this.template()

    this.$el.find('#stripe-form').html(template)

    // $('#card-cvc').on('load', () => {
    this.cardNumber.mount("#card-number")
    this.cardExpiry.mount("#card-expiry")
    this.cardCvc.mount("#card-cvc")
    // })

    return this
  }

  reset(e) {
    this.$el.find('#stripe-form').empty()
    this.parentView.render()
  }

  submit(e) {
    this.parentView.updateCard()
  }
}

export default StripeForm
