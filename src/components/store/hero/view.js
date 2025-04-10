import { View } from 'backbone'

import BackBoneContext from 'core/contexts/backbone-context'

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
    this.context = new BackBoneContext()
    this.mp = this.context.getContext('mp')

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

    this.$el.find('.hero-item a').on('click', (e) => this.logClickEvent(e))

    return this
  }

  logClickEvent(e) {
    console.log('StoreHomeHero logClickEvent', e)
    // debugger
    this.mp.logClickEvent(e)
  }
}

export default StoreHomeHero
