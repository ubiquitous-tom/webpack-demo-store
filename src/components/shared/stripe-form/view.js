import { View } from 'backbone'
import _ from 'underscore'

import SubmitLoader from 'shared/elements/submit-loader'
import './stylesheet.scss'
import template from './index.hbs'
import StripeFormModel from './model'

class StripeForm extends View {
  get el() {
    return '#account'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click #stripe-form button[type="reset"]': 'reset',
      'click #stripe-form button[type="submit"]': 'submit',
    }
  }

  initialize(options) {
    console.log('StripeForm initialize')
    // console.log(this)
    // console.log(options)
    this.submitLoader = new SubmitLoader()
    this.parentView = options.parentView
    // console.log(this.parentView)
    this.model = new StripeFormModel()
    // console.log(Stripe)

    this.listenTo(this.model, 'change:stripeKey', this.initializeStripeForm)
  }

  initializeStripeForm() {
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
    /* eslint no-undef: 0 */
    // this.stripe = Stripe('pk_test_lJqmZftGTxLatArjHLxHumTC')
    this.stripe = Stripe(this.model.get('stripeKey'))

    console.log(this.stripe)
    /* eslint max-len: 0 */
    this.elements = this.stripe.elements({
      locale: 'auto',
      fonts: [
        // {
        //   family: 'futura-pt',
        //   weight: 400,
        //   // src: 'local("Open Sans"), local("OpenSans"), url(https://fonts.g.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3ZBw1xU1rKptJj_0jans920.woff2) format("woff2")',
        //   unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215'
        // }
        {
          cssSrc: 'https://use.typekit.net/how3tbq.css',
        },
      ],
    })

    this.cardNumber = this.elements.create('cardNumber', {
      style: elementStyles,
    })

    this.cardExpiry = this.elements.create('cardExpiry', {
      style: elementStyles,
    })

    this.cardCvc = this.elements.create('cardCvc', {
      style: elementStyles,
    })
    console.log(this)
    this.render()
  }

  render() {
    console.log('StripeForm render')
    // this.$el.find('#stripe-form').html(this.template())

    this.cardNumber.mount('#card-number')
    this.cardExpiry.mount('#card-expiry')
    this.cardCvc.mount('#card-cvc')
    console.log(this)

    return this
  }

  contentPlaceholder() {
    console.log('StripeForm contentPlaceholder')
    this.$el.find('#stripe-form').html(this.template())
  }

  /* eslint no-unused-vars: 0 */
  reset(e) {
    console.log('StripeForm reset')
    this.$el.find('#stripe-form').empty()
    this.parentView.render()
  }

  submit(e) {
    console.log('StripeForm submit')
    e.preventDefault()
    console.log(this.parentView.model)
    this.loadingStart()
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
          // console.log(this, this.parentView)
          this.loadingStop()
          this.$el.find('#stripe-form').empty()
          this.parentView.render()
        }
      })
  }

  loadingStart() {
    this.$el.find('#stripe-form input').prop('disabled', true)
    this.$el.find('#stripe-form button[type="reset"]').prop('disabled', true)
    this.submitLoader.loadingStart(this.$el.find('#stripe-form button[type="submit"]'))
  }

  loadingStop() {
    this.$el.find('#stripe-form input').val('').prop('disabled', false)
    this.$el.find('#stripe-form button[type="reset"]').prop('disabled', false)
    this.submitLoader.loadingStop(this.$el.find('#stripe-form button[type="submit"]'))
  }
}

export default StripeForm
