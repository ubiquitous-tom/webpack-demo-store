import { History, Router } from 'backbone'
import _ from 'underscore'
import BackBoneContext from 'core/contexts/backbone-context'

import Logout from 'shared/elements/logout'

import StoreHome from 'components/store'
import Membership from 'components/membership'
import Give from 'components/give'
import ApplyGiftCode from 'components/apply-gift-code'
// import ApplyPromoCode from 'components/apply-promo-code'
import EditBilling from 'components/edit-billing'
import Review from 'components/review'
import ThankYou from 'components/thank-you'
import MParticle from 'shared/elements/mparticle'

class Workspace extends Router {
  get routes() {
    return {
      membership: 'membership',
      give: 'give',
      applyGiftCode: 'applyGiftCode',
      // applyPromoCode: 'applyPromoCode',
      editBilling: 'editBilling',
      reviewPurchase: 'reviewPurchase',
      thankYou: 'thankYou',
      refresh: 'refresh',
      logout: 'logout',
      '*path': 'home',
    }
  }

  initialize(options) {
    console.log('Router initialize')
    this.model = options.model
    this.i18n = options.i18n
    this.history = new History()
    this.context = new BackBoneContext()
    this.ga = this.context.getContext('ga')
    this.mParticle = new MParticle({ model: this.model })
    // Backbone.history.trigger('route', router, name, args);

    this.listenTo(this, 'navChange', (model, value) => {
      console.log(model, value)
      debugger
    })
  }

  execute(callback, args, name) {
    console.log('Router execute', callback, args, name)
    // this.setActiveSidebar()
    this.setDefaultHome()
    this.ga.logPageView(name)
    this.mParticle.logPageView()

    if (callback) {
      callback.apply(this, args)
    }
  }

  goToLogin() {
    console.log('Router loads goToLogin')
    this.home()
  }

  logout() {
    console.log('Router loads logout')
    new Logout({ model: this.model })
  }

  membership() {
    console.log('Router loads membership')
    new Membership({ model: this.model, i18n: this.i18n })
  }

  give() {
    console.log('Router loads give')
    new Give({ model: this.model, i18n: this.i18n })
  }

  applyGiftCode() {
    console.log('Router loads applyGiftCode')
    new ApplyGiftCode({ model: this.model, i18n: this.i18n })
  }

  // applyPromoCode() {
  //   console.log('Router loads applyPromoCode')
  //   // new ApplyPromoCode({ model: this.model, i18n: this.i18n })
  //   new Membership({ model: this.model, i18n: this.i18n })
  // }

  editBilling() {
    console.log('Router loads editBilling')
    new EditBilling({ model: this.model, i18n: this.i18n })
  }

  reviewPurchase() {
    console.log('Router loads review')
    new Review({ model: this.model, i18n: this.i18n })
  }

  thankYou() {
    console.log('Router loads thankYou')
    new ThankYou({ model: this.model, i18n: this.i18n })
  }

  refresh() {
    History.loadUrl()
    return false
  }

  home() {
    console.log('Route loads home')
    new StoreHome({ model: this.model, i18n: this.i18n })
  }

  // setActiveSidebar() {
  //   // A hack to get default navigation to work
  //   if (!$('ul li').hasClass('active')) {
  //     const hash = !_.isEmpty(window.location.hash) ? window.location.hash : '#home'
  //     $(`${hash}Nav`).addClass('active')
  //   }
  // }

  setDefaultHome() {
    if (_.isEmpty(window.location.hash)) {
      // window.location.hash = '#home'
      this.navigate('home')
    }
  }
}

export default Workspace
