import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class StoreHomeHero extends View {
  get el() {
    return '#landing'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('StoreHomeHero initialize')
    const isRecordedBook = (
      this.model.has('PaymentMethod')
      && this.model.get('PaymentMethod').Store === 'RECORDEDBOOKS'
    )
    this.model.set({ isRecordedBook })

    this.render()
  }

  render() {
    console.log('StoreHomeHero render')

    // Hide Gifting when not in allowed groupname
    const isGroupNameAllowedGifting = this.model.get('isGroupNameAllowedGifting')
    let landingHeroClasses = 'col-sm-6 col-md-4 col-lg-4'
    if (!isGroupNameAllowedGifting) {
      landingHeroClasses = 'col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-2 col-lg-4 col-lg-offset-2'
    }
    const attributes = {
      isGroupNameAllowedGifting,
      landingHeroClasses,
      signupEnv: this.model.get('signupEnv'),
      monthlyPrice: this.model.get('monthlyStripePlan').SubscriptionAmount,
    }

    console.log(this.model.attributes, attributes)
    const html = this.template(attributes)
    // console.log(this.$el, html)
    this.$el.append(html)

    return this
  }
}

export default StoreHomeHero
