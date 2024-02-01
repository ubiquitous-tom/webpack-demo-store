import { View } from 'backbone'

import './stylesheet.scss'
import GiftDeviceImg from 'img/gift-device.png'
import template from './index.hbs'

class StoreHomeGift extends View {
  get el() {
    return '#content-section'
  }

  get temlate() {
    return template
  }

  initialize() {
    console.log('StoreHomeGift initialize')

    // // Hide Gifting when in not allowed groupname
    // const isGroupNameAllowedGifting = true // this.model.get('isGroupNameAllowedGifting')
    // if (isGroupNameAllowedGifting) {
    //   this.render()
    // }
  }

  render() {
    console.log('StoreHomeGift render')
    console.log(this.model.attributes)
    const attributes = {
      GiftDeviceImg,
    }
    const html = this.temlate(attributes)
    console.log(this.$el, html)
    this
      .$('#landing')
      .append(html)

    return this
  }
}

export default StoreHomeGift
