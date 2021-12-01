import { History, Router } from 'backbone'
import _ from 'underscore'

// import Navigation from '../components/shared/navigation/view'
import AccountHome from '../components/account'
import EditEmail from '../components/edit-email'
import EditPassword from '../components/edit-password'
import ApplyPromoCode from '../components/apply-promo-code'
import Logout from '../components/shared/elements/logout'

class Workspace extends Router {

  get routes() {
    return {
      'accountStatus': 'accountStatus',
      'editAccount': 'editAccount',
      'editEmail': 'editEmail',
      'editPassword': 'editPassword',
      'cancelMembership': 'cancelMembership',
      'renewMembership': 'renewMembership',
      'buyMembership': 'buyMembership',
      'applyPromoCode': 'applyPromoCode',
      'refresh': 'refresh',
      'logout': 'logout',
      '*path': 'home',
    }
  }

  // execute(callback, args, name) {
  //   console.log('Workspace', callback, args, name)
  //   // $('ul.nav li').removeClass('active')
  //   // $('#' + name + 'Nav').addClass('active')
  //   if (callback) {
  //     callback.apply(this, args)
  //   }
  // }

  initialize(options) {
    console.log('Router initialize')
    this.model = options.model
    this.dispatcher = options.dispatcher
    this.history = new History()
    // router.trigger('route', name, args);
    // Backbone.history.trigger('route', router, name, args);

    this.dispatcher.on({
      'upgradeToAnnual:success': this.subscriptionUpdatedSuccess,
      'upgradeToAnnual:error': this.subscriptionUpdatedError,
      'downgradeToMonthly:success': this.subscriptionUpdatedSuccess,
      'downgradeToMonthly:error': this.subscriptionUpdatedError,
    }, this)
  }

  goToLogin() {
    console.log('Router loads goToLogin');
    this.accountStatus()
  }

  accountStatus() {
    console.log('Router loads accountStatus')
    const accountHome = new AccountHome({ model: this.model, dispatcher: this.dispatcher })
  }

  logout() {
    console.log('Router loads logout')
    const logout = new Logout()
  }

  editAccount() {
    console.log('Router loads editAccount')
  }

  editEmail() {
    console.log('Router loads editEmail')
    const editEmail = new EditEmail({ model: this.model })
  }

  editPassword() {
    console.log('Router loads editPassword')
    const editPassword = new EditPassword({ model: this.model })
  }

  cancelMembership() {
    console.log('Router loads cancelMembership')
  }

  renewMembership() {
    console.log('Router loads renewMembership')
  }

  buyMembership() {
    console.log('Router loads buyMembership')
  }

  applyPromoCode() {
    console.log('Router loads applyPromoCode')
    const applyPromocode = new ApplyPromoCode({ model: this.model })
  }

  refresh() {
    History.loadUrl()
    return false
  }

  home() {
    this.navigate('accountStatus', true)
  }

  subscriptionUpdatedSuccess(model) {
    console.log('Router subscriptionUpdatedSuccess')
    console.log(this, model)
    debugger
    // this.navigate('accountStatus', { trigger: true, replace: true })
    // let newFragment = Backbone.history.getFragment($(this).attr('href'));
    // if (Backbone.history.fragment == newFragment) {
    //   // need to null out Backbone.history.fragement because
    //   // navigate method will ignore when it is the same as newFragment
    //   Backbone.history.fragment = null;
    //   Backbone.history.navigate(newFragment, true);
    // }
    // this.accountStatus()
    window.location.reload()
  }

  subscriptionUpdatedError(model) {
    console.log('Router subscriptionUpdatedError')
    console.log(this, model)
    debugger
    // this.navigate('accountStatus', { trigger: true, replace: true })
    // this.accountStatus()
    window.location.reload()
  }
}

export default Workspace
