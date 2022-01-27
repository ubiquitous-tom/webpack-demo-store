import { View } from 'backbone'
import _ from 'underscore'

import SubmitLoader from 'shared/elements/submit-loader'
import FlashMessage from 'shared/elements/flash-message'
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
      'input input#nameoncard': 'validateInput',
      'blur input#nameoncard': 'validateBlur',
      'input input#card-zipcode': 'validateInput',
      'blur input#card-zipcode': 'validateBlur',
      'click #stripe-form button[type="reset"]': 'reset',
      'click #stripe-form button[type="submit"]': 'submit',
    }
  }

  initialize(options) {
    console.log('StripeForm initialize')
    // console.log(options)
    this.submitLoader = new SubmitLoader()
    this.flashMessage = new FlashMessage()
    this.i18n = options.i18n
    this.parentView = options.parentView
    // console.log(this.parentView)
    this.model = new StripeFormModel()
    this.model.set({
      country: this.parentView.model.get('BillingAddress').StripeCountryCode,
      stripeCustomerId: this.parentView.model.get('Customer').StripeCustomerID,
      customerId: this.parentView.model.get('Customer').CustomerID,
    })

    this.listenTo(this.model, 'change:stripeKey', this.initializeStripeForm)

    /* eslint no-shadow:0 */
    this.listenTo(this.model, 'change:addNewStripeCardSuccess', (model, value, options) => {
      console.log(model, value, options)
      debugger
      this.loadingStop()
      this.$el.find('#stripe-form').empty()
      this.parentView.render()
      let { message } = model.get('flashMessage')
      const { interpolationOptions, type } = model.get('flashMessage')
      message = this.i18n.t(message, interpolationOptions)
      debugger
      if (!value) {
        this.flashMessage.onFlashMessageShow(message, type)
      }
    })
  }

  initializeStripeForm() {
    const elementStyles = {
      base: {
        iconColor: '#dddddd',
        color: '#464646',
        // fontFamily: 'futura-pt, sans-serif',
        fontFamily: 'Oxygen, sans-serif',
        fontWeight: 400,
        fontSize: '15px',
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
        '::placeholder': {
          color: '#a94442',
        },
      },
    }

    const elementClasses = {
      focus: 'focused',
      empty: 'empty',
      invalid: 'invalid',
    }

    /* eslint no-undef: 0 */
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
          // cssSrc: 'https://use.typekit.net/how3tbq.css',
          cssSrc: 'https://fonts.googleapis.com/css2?family=Oxygen:wght@300;400;700&display=swap',
        },
      ],
    })

    this.cardNumber = this.elements.create('cardNumber', {
      style: elementStyles,
      elementClasses,
    })
      .on('change', (event) => {
        if (event.complete) {
          this.$el.find('#card-number').parent('.item').addClass('has-success')
        } else if (!_.isEmpty(event.error)) {
          this.$el.find('#card-number').parent('.item').addClass('has-error')
        } else {
          this.$el.find('#card-number').parent('.item').removeClass('has-success has-error')
        }
      })

    this.cardExpiry = this.elements.create('cardExpiry', {
      style: elementStyles,
      elementClasses,
    })
      .on('change', (event) => {
        if (event.complete) {
          this.$el.find('#card-expiry').parent('.subitem').addClass('has-success')
        } else if (!_.isEmpty(event.error)) {
          this.$el.find('#card-expiry').parent('.subitem').addClass('has-error')
        } else {
          this.$el.find('#card-expiry').parent('.subitem').removeClass('has-success has-error')
        }
      })

    this.cardCvc = this.elements.create('cardCvc', {
      style: elementStyles,
      elementClasses,
    })
      .on('change', (event) => {
        if (event.complete) {
          this.$el.find('#card-cvc').parent('.subitem').addClass('has-success')
        } else if (!_.isEmpty(event.error)) {
          this.$el.find('#card-cvc').parent('.subitem').addClass('has-error')
        } else {
          this.$el.find('#card-cvc').parent('.subitem').removeClass('has-success has-error')
        }
      })

    this.render()
  }

  render() {
    console.log('StripeForm render')

    this.cardNumber.mount('#card-number')
    this.cardExpiry.mount('#card-expiry')
    this.cardCvc.mount('#card-cvc')

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
    if (this.validateSubmit()) {
      this.generateToken()
    }
  }

  generateToken() {
    const data = {
      name: this.$el.find('#stripe-form #nameoncard').val(),
      address_zip: this.$el.find('#stripe-form #card-zipcode').val(),
      address_country: this.parentView.model.get('country'),
    }
    this.stripe.createToken(this.cardNumber, data)
      .then((result) => {
        if (result.token) {
          const stripeCardTokenID = result.token.id
          const stripeCard = result.token.card
          const updatedStripeCard = _.extend(stripeCard, { token: stripeCardTokenID })
          console.log(updatedStripeCard)
          this.parentView.model.set('newStripeCardInfo', updatedStripeCard)
          // console.log(this, this.parentView)
          this.loadingStop()
          this.$el.find('#stripe-form').empty()
          this.parentView.render()
          // this.addNewStripeCard(stripeCardTokenID)
        } else {
          console.log(result)
          this.loadingStop()
        }
      })
  }

  addNewStripeCard(stripeCardTokenID) {
    this.model.addNewStripeCard(stripeCardTokenID)
  }

  validateInput() {
    if (_.isEmpty(this.$el.find('input#nameoncard').val())) {
      this.$el.find('input#nameoncard').parent('.item').addClass('has-error')
    } else {
      this.$el.find('input#nameoncard').parent('.item').removeClass('has-error')
    }

    if (_.isEmpty(this.$el.find('input#card-zipcode').val())) {
      this.$el.find('input#card-zipcode').parent('.subitem').addClass('has-error')
    } else {
      this.$el.find('input#card-zipcode').parent('.subitem').removeClass('has-error')
    }
  }

  validateBlur() {
    if (
      !_.isEmpty(this.$el.find('input#nameoncard').val())
      && !this.$el.find('input#nameoncard').parent('.item').hasClass('has-error')
    ) {
      this.$el.find('input#nameoncard').parent('.item').addClass('has-success')
    }

    if (
      !_.isEmpty(this.$el.find('input#card-zipcode').val())
      && !this.$el.find('input#card-zipcode').parent('.subitem').hasClass('has-error')
    ) {
      this.$el.find('input#card-zipcode').parent('.subitem').addClass('has-success')
    }
  }

  validateSubmit() {
    this.validateInput()
    if (
      !_.isEmpty(this.$el.find('input#nameoncard').val())
      && !_.isEmpty(this.$el.find('input#card-zipcode').val())
    ) {
      return true
    }
    this.loadingStop()
    return false
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
