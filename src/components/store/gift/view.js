import { View } from 'backbone'

import './stylesheet.scss'
import GiftDeviceImg from './img/gift-device-2025.png'
import template from './index.hbs'

class StoreHomeGift extends View {
  get el() {
    return '#landing'
  }

  get template() {
    return template
  }

  initialize() {
    console.log('StoreHomeGift initialize')

    // Hide Gifting when in not allowed groupname
    const isGroupNameAllowedGifting = this.model.get('isGroupNameAllowedGifting')
    if (isGroupNameAllowedGifting) {
      this.render()
    }
  }

  render() {
    console.log('StoreHomeGift render')
    console.log(this.model.attributes)
    const attributes = {
      GiftDeviceImg,
    }
    const html = this.template(attributes)
    // console.log(this.$el, html)
    this.$el.append(html)

    return this
  }
}

export default StoreHomeGift
