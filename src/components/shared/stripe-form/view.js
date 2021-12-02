import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
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
        fontWeight: 400,
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        '::placeholder': {
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
    // console.log(this)
  }

  render() {
    console.log('StripeForm render')
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
    e.preventDefault()
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
          const stripeCard = result.token.card
          const updatedStripeCard = _.extend(stripeCard, { token: stripeCustomerID })
          console.log(updatedStripeCard)
          this.parentView.model.set('newStripeCardInfo', updatedStripeCard)
          console.log(this, this.parentView)
          this.$el.find('#stripe-form').empty()
          this.parentView.render()
        }
      })
  }
}

export default StripeForm
