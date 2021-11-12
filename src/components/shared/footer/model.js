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
    console.log('Footer Model')
    const locale = new ATVLocale()
    // console.log(locale.attributes)
    this.set(locale.attributes)

    // console.log(this)
    // this.listenTo(this.locale, 'sync', this.merge)
    // this.locale.fetch()
    // .done((resp) => {
    //   console.log('Footer initialize done')
    //   console.log(resp)
    //   // this.render()
    // })
  }
}

export default FooterModel
