import { View } from 'backbone'

import './stylesheet.scss'
import template from './index.hbs'

import GiveSignInModel from './model'

class GiveSignIn extends View {
  get el() {
    return '.give.store.container'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'change #becomeMember': 'getAnnualMembership',
      'submit form': 'signIn',
    }
  }

  initialize(options) {
    console.log('GiveSignIn initialize')
    this.i18n = options.i18n

    this.giveSignInModel = new GiveSignInModel()

    this.listenTo(this.giveSignInModel, 'change:signInSuccess', (model, value) => {
      console.log(model, value)
      debugger
      if (value) {
        window.location.reload()
      } else {
        this.$el.find('.form-group').addClass('has-error')
        this.$el.find('.alert').slideUp()

        this.$el.append(this.modalTemplate())
        this.$el.find('#signInStatus').html(model.get('message'))
        this.$el.find('#signInModal').modal()
      }
    })

    const isLoggedIn = this.model.has('Subscription')
    if (!isLoggedIn) {
      this.render()
    }
  }

  render() {
    console.log('GiveSignIn render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.append(html)

    this.subscriptionOptIn()

    return this
  }

  subscriptionOptIn() {
    if (this.model.get('cart')?.get('annual')?.quantity > 0) {
      this.$el.find('#becomeMember').prop('checked', true)
    }
  }

  getAnnualMembership(e) {
    console.log('GiveSignIn getAnnualMembership')
    e.preventDefault()
    console.log(e.target, e.target.checked)
    const optIn = e.target.checked // this.$('#becomeMember').is(':checked');
    if (optIn) {
      // if (this.model.get('cart')?.get('annual')?.quantity > 0) {
      const quantity = 1
      const amount = (this.model.has('membershipPromo'))
        ? this.model.get('cart')?.get('annual')?.amount
        : this.model.get('annualStripePlan')?.SubscriptionAmount
      const total = parseFloat((quantity * amount).toFixed(2))
      const membership = {
        annual: {
          quantity,
          amount,
          total,
        },
      }
      this.model.get('cart').set(membership)
      // }
      console.log(this.model.attributes)
    } else {
      this.removeAnnualMembership()
    }
  }

  removeAnnualMembership() {
    console.log('GiveTaGiveSignInline removeMember')
    // this.model.get('cart').unset('annual')
    const quantity = 0
    const amount = (this.model.has('membershipPromo'))
      ? this.model.get('cart')?.get('annual')?.amount
      : this.model.get('annualStripePlan')?.SubscriptionAmount
    const total = 0
    const membership = {
      annual: {
        quantity,
        amount,
        total,
      },
    }
    this.model.get('cart').set(membership)
    console.log(this.model.attributes)
  }

  signIn(e) {
    console.log('GiveSignIn signIn')
    e.preventDefault()
    const data = {
      email: this.$el.find('#signInEmail').val(),
      password: this.$el.find('#password').val(),
    }
    this.giveSignInModel.signIn(data)
  }
}

export default GiveSignIn
