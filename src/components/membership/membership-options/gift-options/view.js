import { Model, View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import template from './index.hbs'

class MembershipGiftOptions extends View {
  get el() {
    return '#membership-options'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'change #qty': 'updateGiftPrice',
    }
  }

  initialize(options) {
    console.log('MembershipGiftOptions initialize')
    this.i18n = options.i18n
    this.gifting = this.model.get('gifting')
    this.cart = this.model.get('cart')

    this.giftOptionsModel = new Model()
    // const isLoggedIn = this.model.get('Session').LoggedIn
    // const isRecordedBook = (
    //   this.model.has('Membership')
    //   && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    // )

    const isGroupNameAllowedGifting = this.model.get('isGroupNameAllowedGifting')
    // const membershipActive = this.model.get('Membership').Status.toUpperCase() === 'ACTIVE'
    if (isGroupNameAllowedGifting) {
      const giftAmount = this.gifting.get('amount')
      const giftPrice = [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        this.gifting.get('gift').amount,
      ].join('')
      const optionsEls = this.giftOptions()
      const total = this.total()

      this.giftOptionsModel.set({
        giftAmount,
        giftPrice,
        optionsEls,
        total,
      })
      this.render()
    }
  }

  render() {
    console.log('MembershipGiftOptions render')
    console.log(this.model.attributes, this.giftOptionsModel.attributes)
    const html = this.template(this.giftOptionsModel.attributes)
    this.$el.append(html)

    this.selectDefaultGiftQuantity()

    return this
  }

  giftOptions() {
    let options = `<option value="0">${this.i18n.t('SELECT-QTY')}</option>`
    _.each(_.range(1, 4), (i) => {
      options += `<option value="${i}">${i}</option>`
    })

    return options
  }

  total() {
    let total = this.i18n.t('NO-GIFT-SELECTED')
    const giftQuantity = this.cart.has('gift') ? this.cart.get('gift').quantity : 0
    const giftPrice = this.cart.has('gift') ? this.cart.get('gift').amount : 0
    if (giftQuantity) {
      const totalGiftAmount = (giftQuantity * giftPrice).toFixed(2)
      total = `${this.i18n.t('TOTAL')} <span>${totalGiftAmount}</span>`
    }

    return total
  }

  selectDefaultGiftQuantity() {
    if (this.cart.has('gift')) {
      const { quantity } = this.cart.get('gift')
      this.$el.find(`#qty option[value="${quantity}"]`).prop('selected', true)
    }
  }

  updateGiftPrice(e) {
    console.log('MembershipGiftOptions updateGiftPrice')
    e.preventDefault()
    console.log(e, e.target.value)
    const quantity = e.target.value
    const { amount } = this.gifting.get('gift')
    const total = [
      this.gifting.get('gift').CurrencyDesc,
      this.gifting.get('gift').CurrSymbol,
      (quantity * amount).toFixed(2),
    ].join('')
    // const total = [
    //   this.model.get('annualStripePlan').CurrencyDesc,
    //   this.model.get('annualStripePlan').CurrSymbol,
    //   this.updateGiftPriceWithTimelinePromotion(quantity, amount),
    // ].join('')
    // debugger
    const html = (quantity > 0)
      ? `${this.i18n.t('TOTAL')} <span>${total}</span>`
      : this.i18n.t('NO-GIFT-SELECTED')
    this.$el.find('#quantityTotal strong').html(html)

    this.updateCart(e)
  }

  // updateGiftPriceWithTimelinePromotion(quantity, amount) {
  //   console.log('GiveGiftMembership updateGiftPrice')
  //   let total = (parseInt(quantity, 10) * parseFloat(amount)).toFixed(2)

  //   if (this.model.has('DiscountRate')) {
  //     const giftItem = this.model.get('DiscountRate').find(
  //       ({ count }) => count === parseInt(quantity, 10),
  //     )
  //     total = (parseInt(quantity, 10) * parseFloat(giftItem.Amount)).toFixed(2)
  //     // debugger
  //   }

  //   return total
  // }

  updateCart(e) {
    console.log('MembershipGiftOptions updateCart')
    const quantity = e.target.value
    if (quantity > 0) {
      const { amount } = this.gifting.get('gift')
      const total = (quantity * amount).toFixed(2)
      const gift = {
        quantity: Number(quantity),
        amount,
        total: parseFloat(total),
      }
      this.cart.set(
        { gift },
        { context: this },
      )
    } else {
      this.cart.unset('gift', { silent: true })
    }
    console.log(this.model.attributes)
  }
}

export default MembershipGiftOptions
