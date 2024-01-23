import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import template from './index.hbs'

import ReCaptchaModel from './model'

class ReCaptcha extends View {
  get el() {
    return '#stripe-form'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('ReCaptcha initialze')
    this.model = new ReCaptchaModel()

    /* eslint-disable no-undef */
    console.log(grecaptcha)

    this.listenTo(this.model, 'change:generateCaptchaTokenSuccess', (model, value, options) => {
      console.log(model, value, options)
      console.log(model.get('captchaToken'))
      // debugger
      if (value) {
        model.set({
          setCaptchaTokenSuccess: true,
        })
      } else {
        model.set({
          setCaptchaTokenSuccess: false,
        })
      }
    })

    // this.listenTo(this.model, 'change:reCaptchaVerifySuccess', (model, value, options) => {
    //   console.log(model, value, options)
    //   console.log(this)
    //   debugger
    // })
  }

  render() {
    if (!this.model.get('isCaptchaV2Rendered')) {
      this.model.set({
        captchaToken: '',
        captchaVersion: 'v2',
      })

      const html = this.template()
      this.$el.find('.group').append(html)

      this.renderCaptchaV2()
    }

    return this
  }

  generateCaptchaToken() {
    if (this.model.get('isCaptchaTested')) {
      this.generateV2Token()
    } else {
      this.generateV3Token()
    }
  }

  generateV3Token() {
    console.log('ReCaptchaModel generateV3Token')
    const v3Key = this.model.get('v3Key')
    console.log(v3Key)
    grecaptcha.ready(() => {
      grecaptcha.execute(v3Key, { action: 'submit' }).then((captchaToken) => {
        console.log(captchaToken)

        this.model.set({
          generateCaptchaTokenSuccess: !_.isEmpty(captchaToken),
          captchaToken,
        })
        console.log(this.model)
      })
    })
  }

  generateV2Token() {
    console.log('ReCaptchaModel generateV2Token')
    const captchaToken = grecaptcha.getResponse()
    console.log(captchaToken)

    this.model.set({
      generateCaptchaTokenSuccess: !_.isEmpty(captchaToken),
      captchaToken,
    })

    console.log(this.model)
  }

  renderCaptchaV2() {
    console.log(grecaptcha, this.model, this.model.get('v2Key'))
    const sitekey = this.model.get('v2Key')
    grecaptcha.ready(() => {
      this.captcha = grecaptcha.render('captcha-v2', {
        sitekey,
      })
    })
  }

  resetCaptcha() {
    console.log(grecaptcha)
    grecaptcha.reset(this.captcha)
  }
}

export default ReCaptcha
