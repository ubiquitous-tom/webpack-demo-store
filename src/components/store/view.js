import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

// import StoreHomeModel from './model'
import StoreHomeHero from './hero'
// import StoreHomeCallout from './callout'
import StoreHomeContent from './content'
import StoreHomeGift from './gift'

class StoreHome extends View {
  get el() {
    return '#content-section'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click a': 'navigate',
    }
  }

  initialize(options) {
    console.log('StoreHome initialize')
    console.log(this.model.attributes)
    this.i18n = options.i18n
    // this.model = new StoreHomeModel(this.model.attributes)
    // console.log(this.model)
    // this.render()
    // this.listenTo(this.model, 'sync error', this.render)
    // this.listenTo(this.model, 'change', this.render)
    this.render()
  }

  render() {
    console.log('StoreHome render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    console.log(this.$el, html)
    this.$el.html(html)

    // Initialize late in order for all the element to be added to the main dom
    this.storeHomeHero = new StoreHomeHero({ model: this.model, i18n: this.i18n })
    // this.storeHomeCalloout = new StoreHomeCallout({ model: this.model, i18n: this.i18n })
    this.storeHomeCotent = new StoreHomeContent({ model: this.model, i18n: this.i18n })
    this.storeHomeGift = new StoreHomeGift({ model: this.model, i18n: this.i18n })

    return this
  }
}

export default StoreHome
