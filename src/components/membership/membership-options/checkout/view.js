import Backbone, { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

class MembershipCheckout extends View {
  get el() {
    return '#membership-options'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'click .checkout a': 'checkout',
    }
  }

  initialize() {
    console.log('MembershipCheckout initialize')

    this.listenTo(this.model, 'change:checkoutSuccess', (model, value) => {
      console.log(model, value)
      debugger
      if (value) {
        // giveObj.set("AllowedToCheckout", true);
      } else {
        // this.$el.find('.form-group').addClass('has-error');
        // this.$signInAlert.slideUp();

        // this.$signInStatus.html(response.responseJSON.error);
        // this.$signInModal.modal();
        // giveObj.set("AllowedToCheckout", false);
      }
    })
    // const isLoggedIn = this.model.get('Session').LoggedIn
    // const isRecordedBook = (
    //   this.model.has('Membership')
    //   && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    // )

    this.listenTo(this.model, 'membership:signedInCheckout', (value) => {
      console.log('membership:signedInCheckout', value)
      // debugger
      this.navigateTo()
    })

    // const isGroupNameAllowedGifting = true // this.model.get('isGroupNameAllowedGifting')
    // const membershipActive = this.model.get('Membership').Status.toUpperCase() === 'ACTIVE'

    this.render()
  }

  render() {
    console.log('MembershipCheckout render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.append(html)

    return this
  }

  checkout(e) {
    console.log('MembershipCheckout checkout')
    e.preventDefault()
    // Router.trigget('isCartEmpty')
    this.navigateTo()
  }

  navigateTo() {
    const isLoggedIn = this.model.has('Subscription')
    const isStripeEnabled = this.model.get('Customer')?.StripeEnabled
    if (isLoggedIn) {
      if (isStripeEnabled) {
        Backbone.history.navigate('reviewPurchase', { trigger: true })
      } else {
        // Backbone.history.trigger('navChange', 'editBilling')
        Backbone.history.navigate('editBilling', { trigger: true })
      }
    } else {
      this.model.trigger('membership:checkout')
    }
    // if (stripeCustomer && sessionLoggedIn) {
    //   Backbone.trigger('navChange', 'reviewPurchase');
    // } else {
    //   Backbone.trigger('navChange', 'editBilling');
    //   this.model.set('Customer', customer);
    // }
  }
}

export default MembershipCheckout
