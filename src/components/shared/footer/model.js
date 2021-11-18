import { Model } from 'backbone'
import _ from 'underscore'

import ATVLocale from 'common/models/locale'
import ATVModel from 'common/model'

class FooterModel extends ATVModel {

  get defaults() {
    return {
      currentYear: new Date().getFullYear()
    }
  }

  initialize() {
    console.log('FooterModel initialize')
    const locale = new ATVLocale()
    // console.log(locale.attributes)

    locale.on('sync', (model) => {
      console.log('FooterModel ATVLocal sync')
      // console.log(model)
      this.set(model.attributes)
    })

    if (!_.isEmpty(locale.attributes.languages)) {
      this.set(locale.attributes)
    }
  }
}

export default FooterModel
