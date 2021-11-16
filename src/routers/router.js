import { Router } from 'backbone'
import _ from 'underscore'

// import Navigation from '../components/shared/navigation/view'
import AccountHome from '../components/account'
import EditEmail from '../components/edit-email'
import EditPassword from '../components/edit-password'
import ApplyPromoCode from '../components/apply-promo-code'
import Logout from '../components/common/logout'

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

  initialize() {
    // this.navigation = new Navigation()
    console.log('Router initialize')
    // router.trigger('route', name, args);
    // Backbone.history.trigger('route', router, name, args);

    // this.on('route', this.setActive)
  }

  setActive(name, args) {
    console.log('Router setActive')
    console.log(name, args)
    $(`#${name}Nav`).addClass('active')
  }

  goToLogin() {
    console.log('Router loads goToLogin');
    this.accountStatus()
  }

  accountStatus() {
    console.log('Router loads accountStatus')
    const accountHome = new AccountHome()
    // accountHome.render()
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
    const editEmail = new EditEmail()
  }

  editPassword() {
    console.log('Router loads editPassword')
    const editPassword = new EditPassword()
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
    const applyPromocode = new ApplyPromoCode()
  }

  home() {
    this.navigate('accountStatus', true)
  }
}

export default Workspace
