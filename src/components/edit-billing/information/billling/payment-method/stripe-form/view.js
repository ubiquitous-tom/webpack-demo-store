import Backbone, { View } from 'backbone'
import _ from 'underscore'

import CSRFAuthorization from 'core/models/csrf-authorization'
import BackBoneContext from 'core/contexts/backbone-context'
import SubmitLoader from 'shared/elements/submit-loader'
import FlashMessage from 'shared/elements/flash-message'
import ReCaptcha from 'shared/recaptcha'

import './stylesheet.scss'
import template from './index.hbs'

import StripeFormModel from './model'

class StripeForm extends View {
  get el() {
    return 'form.form-trial-signup #paymentMethod'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'input input#nameoncard': 'validateInputName',
      'click #stripe-form button[type="reset"]': 'reset',
      'click #stripe-form button[type="submit"]': 'submit',
    }
  }

  initialize(options) {
    console.log('StripeForm initialize')
    // console.log(options)
    // this.csrfAuthorization = new CSRFAuthorization(options.parentView)
    // this.reCaptcha = new ReCaptcha()
    this.submitLoader = new SubmitLoader()
    this.flashMessage = new FlashMessage()
    this.i18n = options.i18n
    this.parentView = options.parentView
    // console.log(this.parentView)
    this.model = new StripeFormModel()
    // this.model.set({
    //   country: this.parentView.model.get('BillingAddress').StripeCountryCode,
    //   stripeCustomerId: this.parentView.model.get('Customer').StripeCustomerID,
    //   customerId: this.parentView.model.get('Customer').CustomerID,
    // })

    // this.listenTo(this.csrfAuthorization.model, 'change:setCSRFAuthorizationSuccess', (model, value, options) => {
    //   console.log(model, value, options)
    //   console.log(model.get('csrfToken'))
    //   // debugger
    //   if (value) {
    //     const csrfToken = model.get('csrfToken')
    //     this.model.set('csrfToken', csrfToken)
    //   } else {
    //     let message = 'ERR-PROCESS-REQUEST'
    //     const interpolationOptions = {}
    //     const type = 'error'
    //     message = this.i18n.t(message, interpolationOptions)
    //     this.flashMessage.onFlashMessageShow(message, type)
    //   }
    // })

    // this.listenTo(this.reCaptcha.model, 'change:setCaptchaTokenSuccess', (model, value, options) => {
    //   console.log(model, value, options)
    //   console.log(model.get('captchaToken'))
    //   const captchaToken = model.get('captchaToken')
    //   this.model.set({
    //     captchaVersion: this.reCaptcha.model.get('captchaVersion'),
    //   })
    //   // debugger
    //   if (value) {
    //     const newStripeCardInfo = {
    //       stripeCardTokenID: this.model.get('stripeCardTokenID'),
    //       captchaToken,
    //       captchaVersion: this.reCaptcha.model.get('captchaVersion'),
    //       csrfToken: this.csrfAuthorization.model.get('csrfToken'),
    //     }
    //     // this.model.addNewStripeCard(newStripeCardInfo)
    //   } else {
    //     this.reCaptcha.render()
    //     // This is set after `render()` so we can't render reCaptcha V2 again to prevent an infinite loop.
    //     this.reCaptcha.model.set({
    //       isCaptchaV2Rendered: true,
    //     })
    //   }
    // })

    this.listenTo(this.model, 'change:stripeKey', this.initializeStripeForm)

    /* eslint no-shadow:0 */
    this.listenTo(this.model, 'change:csrfValidationSuccess', (model, value, options) => {
      console.log(model, value, options)
      // debugger
      if (value) {
        console.log('csrf validation passed')
        debugger
      } else {
        console.log('csrf validation failed')
        debugger
      }
    })

    // this.listenTo(this.model, 'change:captchaValidationV3Success', (model, value, options) => {
    //   console.log(model, value, options)
    //   debugger
    //   if (value) {
    //     console.log('captcha validation passed')
    //     debugger
    //   } else {
    //     console.log('captcha validation failed')
    //     debugger
    //     this.reCaptcha.model.set({
    //       isCaptchaTested: true,
    //       generateCaptchaTokenSuccess: false,
    //     })
    //   }
    // })

    // this.listenTo(this.model, 'change:captchaValidationV2Success', (model, value, options) => {
    //   console.log(model, value, options)
    //   debugger
    //   let { message } = model.get('flashMessage')
    //   const { interpolationOptions, type } = model.get('flashMessage')
    //   message = this.i18n.t(message, interpolationOptions)
    //   if (value) {
    //     console.log('captcha validation passed')
    //     debugger
    //   } else {
    //     console.log('captcha validation failed')
    //     debugger
    //     this.flashMessage.onFlashMessageShow(message, type)
    //   }
    // })

    this.listenTo(this.model, 'change:addNewStripeCardSuccess', (model, value, options) => {
      console.log(model, value, options)
      debugger
      this.loadingStop()

      let { message } = model.get('flashMessage')
      const { interpolationOptions, type } = model.get('flashMessage')
      message = this.i18n.t(message, interpolationOptions)
      if (value) {
        debugger
        // this.$el.find('#stripe-form').empty()
        // this.parentView.render()
        Backbone.history.navigate('reviewPurchase', { trigger: true })
      }
      //  else {
      //   this.resetStripeForm()
      // }
      this.flashMessage.onFlashMessageShow(message, type)
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
        // color: '#3c763d',
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

    // https://stripe.com/docs/js/elements_object/create_element?type=card
    // https://stripe.com/docs/js/appendix/style?type=card
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
          this.$el.find('#card-number').parent('.form-group')
        } else if (!_.isEmpty(event.error)) {
          this.$el.find('#card-number').parent('.form-group').addClass('has-error')
        } else {
          this.$el.find('#card-number').parent('.form-group').removeClass('has-success has-error')
        }
      })

    this.cardExpiry = this.elements.create('cardExpiry', {
      style: elementStyles,
      elementClasses,
    })
      .on('change', (event) => {
        if (event.complete) {
          this.$el.find('#card-expiry').parent('.form-group')
        } else if (!_.isEmpty(event.error)) {
          this.$el.find('#card-expiry').parent('.form-group').addClass('has-error')
        } else {
          this.$el.find('#card-expiry').parent('.form-group').removeClass('has-success has-error')
        }
      })

    this.cardCvc = this.elements.create('cardCvc', {
      style: elementStyles,
      elementClasses,
    })
      .on('change', (event) => {
        if (event.complete) {
          this.$el.find('#card-cvc').parent('.form-group')
        } else if (!_.isEmpty(event.error)) {
          this.$el.find('#card-cvc').parent('.form-group').addClass('has-error')
        } else {
          this.$el.find('#card-cvc').parent('.form-group').removeClass('has-success has-error')
        }
      })

    this.render()
  }

  resetStripeForm() {
    this.cardNumber.clear()
    this.cardExpiry.clear()
    this.cardCvc.clear()
  }

  render() {
    console.log('StripeForm render')

    this.cardNumber.mount('#card-number')
    this.cardExpiry.mount('#card-expiry')
    this.cardCvc.mount('#card-cvc')

    // this.csrfAuthorization.setPreAuth()
    this.parentView.model.trigger('stripeForm:initialized')

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

    this.reCaptcha.resetCaptcha()
  }

  submit(e) {
    console.log('StripeForm submit')
    e.preventDefault()
    console.log(this.parentView.model)
    this.loadingStart()
    if (this.validateSubmit()) {
      console.log('this.generateToken')
      this.generateToken()
    }
  }

  onCaptchaSubmit() {
    console.log('onCaptchaSubmit')
  }

  generateToken() {
    let gaAction = 'Success'
    let gaLabel = 'Success'
    const data = {
      name: this.$el.find('#nameoncard').val(),
      address_zip: this.parentView.model.get('editBillingForm').address_zip,
      address_country: this.parentView.model.get('editBillingForm').address_country,
    }
    this.stripe.createToken(this.cardNumber, data)
      .then((result) => {
        if (result.token) {
          const stripeCardTokenID = result.token.id
          const stripeCard = result.token.card
          const updatedStripeCard = _.extend(stripeCard, { token: stripeCardTokenID })
          console.log(updatedStripeCard)
          this.parentView.model.set('newStripeCardInfo', updatedStripeCard)
          this.parentView.model.set('stripeCardTokenID', stripeCardTokenID, { context: this.parentView })
          this.model.set('stripeCardTokenID', stripeCardTokenID)
          // console.log(this, this.parentView)
          this.loadingStop()
          // // This was moved into `change:addNewStripeCardSuccess` event.
          // this.$el.find('#stripe-form').empty()
          // this.parentView.render()

          // If this is `#updatecard` page then update card by adding new card to the account.
          // if (this.$el.find('#stripe-form.update-cc').length) {
          //   debugger
          //   this.model.addNewStripeCard(stripeCardTokenID)
          // }
          // this.reCaptcha.generateCaptchaToken()
        } else {
          console.log(result)
          gaAction = 'Failed'
          gaLabel = result.error
          this.loadingStop()
          this.parentView.model.trigger('stripeCardTokenIDError', result.error)
        }
        this.triggerGA(gaAction, gaLabel)
      })
  }

  validateInputName() {
    let isValidated = true
    if (_.isEmpty(this.$el.find('input#nameoncard').val())) {
      this.$el.find('input#nameoncard').parent('.form-group').removeClass('has-success').addClass('has-error')
      isValidated = false
    } else {
      this.$el.find('input#nameoncard').parent('.form-group').removeClass('has-error')
    }

    return isValidated
  }

  validateInputZipcode() {
    let isValidated = true
    if (_.isEmpty(this.$el.find('input#billingzip').val())) {
      this.$el.find('input#billingzip').parent('.form-group').removeClass('has-success').addClass('has-error')
      isValidated = false
    } else {
      this.$el.find('input#billingzip').parent('.form-group').removeClass('has-error')
    }

    return isValidated
  }

  validateBlurName() {
    if (
      !_.isEmpty(this.$el.find('input#nameoncard').val())
      && !this.$el.find('input#nameoncard').parent('.form-group').hasClass('has-error')
    ) {
      this.$el.find('input#nameoncard').parent('.form-group') // .addClass('has-success')
    }
  }

  validateBlurZipcode() {
    if (
      !_.isEmpty(this.$el.find('input#billingzip').val())
      && !this.$el.find('input#billingzip').parent('.form-group').hasClass('has-error')
    ) {
      this.$el.find('input#billingzip').parent('.form-group') // .addClass('has-success')
    }
  }

  validateSubmit() {
    if (
      this.validateInputName()
      && this.validateInputZipcode()
      && !_.isEmpty(this.$el.find('input#nameoncard').val())
      && !_.isEmpty(this.$el.find('input#billingzip').val())
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
    this.$el.find('#stripe-form input').prop('disabled', false)
    this.$el.find('#stripe-form button[type="reset"]').prop('disabled', false)
    this.submitLoader.loadingStop(this.$el.find('#stripe-form button[type="submit"]'))
  }

  triggerGA(gaAction, gaLabel) {
    const gaCategory = 'Update Billing Information'
    this.context = new BackBoneContext()
    this.ga = this.context.getContext('ga')
    this.ga.logEvent(gaCategory, gaAction, gaLabel)
  }
}

export default StripeForm
