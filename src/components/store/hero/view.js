import { Model, View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class StoreHomeHero extends View {
  get el() {
    return '#content-section'
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

    this.storeHomeHeroModel = new Model()
    this.storeHomeHeroModel.set({ isRecordedBook })

    // Hide Gifting when not in allowed groupname
    const isGroupNameAllowedGifting = this.model.get('isGroupNameAllowedGifting')
    let landingHeroClasses = 'col-sm-6 col-md-4 col-lg-4'
    if (!isGroupNameAllowedGifting) {
      landingHeroClasses = 'col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-2 col-lg-4 col-lg-offset-2'
    }
    this.storeHomeHeroModel.set({
      isGroupNameAllowedGifting,
      landingHeroClasses,
    })

    // this.render()
  }

  render() {
    console.log('StoreHomeHero render')
    console.log(this.model.attributes, this.storeHomeHeroModel.attributes)
    const html = this.template(this.storeHomeHeroModel.attributes)
    console.log(this.$el, html)
    this
      .$('#landing')
      .append(html)

    return this
  }
}

export default StoreHomeHero
