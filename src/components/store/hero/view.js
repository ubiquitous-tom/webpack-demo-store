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

    // Hide Gifting when not in allowed groupname
    const isGroupNameAllowedGifting = true // this.model.get('isGroupNameAllowedGifting')
    let landingHeroClasses = 'col-sm-6 col-md-4 col-lg-4'
    if (!isGroupNameAllowedGifting) {
      landingHeroClasses = 'col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-2 col-lg-4 col-lg-offset-2'
    }
    this.model.set({
      isGroupNameAllowedGifting,
      landingHeroClasses,
    })

    this.render()
  }

  render() {
    console.log('StoreHomeHero render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    console.log(this.$el, html)
    this.$el.append(html)

    return this
  }
}

export default StoreHomeHero
