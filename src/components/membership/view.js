import { View } from 'backbone'

import template from './index.hbs'

import MembershipGiveDetails from './give-details'
import MembershipSignedIn from './signed-in'
import MembershipSignUp from './sign-up'
import MembershipSignIn from './sign-in'
import MembershipCurrencyOptions from './currency-options'
import MembershipOptions from './membership-options'
import MembershipLegal from './legal'
// import MembershipModel from './model'

class Membership extends View {
  get el() {
    return '#content-section'
  }

  get template() {
    return template
  }

  initialize(options) {
    console.log('Membership initialize')
    console.log(this.model)
    this.i18n = options.i18n
    // this.model = new MembershipModel(this.model.attributes)

    // this.giftCart.on('change', (model, value) => {
    //   console.log(model, value)
    //   debugger
    //   this.cart.set({
    //     gift: model,
    //   })
    // })

    // this.listenTo(this.model, 'change:monthlyStripePlan', (model, value) => {
    //   console.log(model, value)
    //   // console.log(this.model.get('cart'), this.model.get('cart').get('gift'))
    //   // console.log(this.model.get('gift'))
    //   // // debugger
    //   // this.model.get('cart').set({
    //   //   gift: {
    //   //     quantity: this.model.get('gift').quantity,
    //   //     giftAmount: this.model.get('gift').amount,
    //   //   },
    //   // })
    // })

    this.model.set({
      storeType: 'Membership',
    })

    this.render()
  }

  render() {
    console.log('Membership render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.html(html)

    // const isLoggedIn = this.model.get('Session').LoggedIn
    // const isMembershipActive = (
    //   this.model.has('Membership') || (this.model.get('Membership').Status === 'ACTIVE')
    // )

    this.membershipGiveDetails = new MembershipGiveDetails({ model: this.model, i18n: this.i18n })
    if (this.model.has('Subscription')) {
      this.membershipSignedIn = new MembershipSignedIn({ model: this.model, i18n: this.i18n })
    } else {
      this.membershipSignUp = new MembershipSignUp({ model: this.model, i18n: this.i18n })
      this.membershipSignIn = new MembershipSignIn({ model: this.model, i18n: this.i18n })
      this.membershipCurrencyOptions = new MembershipCurrencyOptions({
        model: this.model,
        i18n: this.i18n,
      })

      this.model.set({
        membershipSignUp: this.membershipSignUp,
        membershipSignIn: this.membershipSignIn,
      })
      this.membershipSignUp.render()
    }
    this.membershipOptions = new MembershipOptions({ model: this.model, i18n: this.i18n })
    this.membershipLegal = new MembershipLegal({ model: this.model, i18n: this.i18n })

    return this
  }
}

export default Membership
