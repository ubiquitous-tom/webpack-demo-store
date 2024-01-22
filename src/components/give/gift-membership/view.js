import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import GiftBox from './img/gift-box.png'
import template from './index.hbs'

class GiveGiftMembership extends View {
  get el() {
    return '.give.store.container'
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
    console.log('GiveGiftMembership initialize')
    this.i18n = options.i18n
    this.gifting = this.model.get('gifting')
    this.cart = this.model.get('cart')
    // const isLoggedIn = this.model.get('Session').LoggedIn
    // const isRecordedBook = (
    //   this.model.has('Membership')
    //   && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    // )

    const isGroupNameAllowedGifting = true // this.model.get('isGroupNameAllowedGifting')
    // const membershipActive = this.model.get('Membership').Status.toUpperCase() === 'ACTIVE'
    if (isGroupNameAllowedGifting) {
      const giftPrice = [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        this.gifting.get('gift').amount,
      ].join('')

      this.model.set({
        GiftBox,
        giftPrice,
        options: this.giftOptions(),
        total: this.total(),
      })
      this.render()
    }
  }

  render() {
    console.log('GiveGiftMembership render')
    console.log(this.model.attributes)
    const html = this.template(this.model.attributes)
    this.$el.append(html)

    this.renderTimelinePromotionAccent()
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
    let total = ''
    const giftQuantity = this.gifting.get('gift').quantity
    const giftPrice = this.gifting.get('gift').amount
    if (giftQuantity === 0) {
      total = this.i18n.t('NO-GIFT-SELECTED')
    } else {
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

  renderTimelinePromotionAccent() {
    // Timeline Promotion styling.
    if (this.model.has('DiscountRate')) {
      this.$el.find('.order-item.gift-item .item-price').remove()
      if (this.$('.currency').length) {
        this.$('.currency').hide()
      }

      _.each(this.$el.find('.order-item.gift-item .special-discount-listing li'), (li, index) => {
        if (index > 0) {
          let text = $(li).html()
          const reg1 = /\(/gi
          const replace1 = '<span class="accent">('
          const reg2 = /\)/gi
          const replace2 = ')</span>'
          text = text.replace(reg1, replace1)
          text = text.replace(reg2, replace2)
          $(li).html(text)
        }
        return li
      })
    }
  }

  updateGiftPrice(e) {
    console.log('GiveGiftMembership updateGiftPrice')
    e.preventDefault()
    console.log(e, e.target.value)
    const quantity = e.target.value
    const { amount } = this.gifting.get('gift')
    // const total = (quantity * amount).toFixed(2)
    const total = [
      this.model.get('annualStripePlan').CurrencyDesc,
      this.model.get('annualStripePlan').CurrSymbol,
      this.updateGiftPriceWithTimelinePromotion(quantity, amount),
    ].join('')
    // debugger
    const html = (quantity > 0)
      ? `${this.i18n.t('TOTAL')} <span>${total}</span>`
      : this.i18n.t('NO-GIFT-SELECTED')
    this.$el.find('#quantityTotal strong').html(html)

    this.updateCart(e)
  }

  updateGiftPriceWithTimelinePromotion(quantity, amount) {
    console.log('GiveGiftMembership updateGiftPrice')
    let total = (parseInt(quantity, 10) * parseFloat(amount)).toFixed(2)

    if (this.model.has('DiscountRate')) {
      const giftItem = this.model.get('DiscountRate').find(({ count }) => count === parseInt(quantity, 10))
      total = (parseInt(quantity, 10) * parseFloat(giftItem.Amount)).toFixed(2)
      // debugger
    }

    return total
  }

  updateCart(e) {
    console.log('GiveGiftMembership updateCart')
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

export default GiveGiftMembership
