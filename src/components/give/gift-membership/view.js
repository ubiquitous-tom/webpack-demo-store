import { Model, View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import giftBoxImg from './img/gift-box.png'
import template from './index.hbs'

class GiveGiftMembership extends View {
  get el() {
    return '#content-section'
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

    this.giftMembershipModel = new Model()
    // const isLoggedIn = this.model.get('Session').LoggedIn
    // const isRecordedBook = (
    //   this.model.has('Membership')
    //   && this.model.get('Membership').Store === 'RECORDEDBOOKS'
    // )

    const isGroupNameAllowedGifting = this.model.get('isGroupNameAllowedGifting')
    // const membershipActive = this.model.get('Membership').Status.toUpperCase() === 'ACTIVE'
    if (isGroupNameAllowedGifting) {
      const giftAmount = this.gifting.get('amount')
      const discountRate = this.model.has('DiscountRate')
      const giftPrice = [
        this.gifting.get('gift').CurrencyDesc,
        this.gifting.get('gift').CurrSymbol,
        this.gifting.get('gift').amount,
      ].join('')
      const optionsEls = this.giftOptions()
      const total = this.total()

      this.giftMembershipModel.set({
        giftAmount,
        discountRate,
        giftBoxImg,
        giftPrice,
        optionsEls,
        total,
      })

      // this.render()
    }
  }

  render() {
    console.log('GiveGiftMembership render')
    console.log(this.model.attributes)

    const html = this.template(this.giftMembershipModel.attributes)
    this
      .$('.give.store.container')
      .append(html)

    this.renderTimelineHTML()

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
      this.$(`#qty option[value="${quantity}"]`).prop('selected', true)
    }
  }

  renderTimelineHTML() {
    if (this.model.has('DiscountRate')) {
      const div = $('<div>').addClass('special-discount-listing').append($('<ul>'))
      _.each(this.model.get('DiscountRate'), (element, index, list) => {
        console.log(element, index, list)
        const giftPrice = [
          this.gifting.get('gift').CurrencyDesc,
          this.gifting.get('gift').CurrSymbol,
          element.Amount,
        ].join('')
        const percentOff = element.DiscountPct * 100
        const html = this.i18n.t(`BLACK-FRIDAY-PROMO-LIST-${index + 1}-2024`, { giftPrice, percentOff })
        // console.log(html)
        div.find('ul').append($('<li>').html(html))
        // console.log(div[0])
      })
      console.log(div)
      this.$('#special-discount').append(div)
    }
  }

  renderTimelinePromotionAccent() {
    // Timeline Promotion styling.
    if (this.model.has('DiscountRate')) {
      this.$('.order-item.gift-item .item-price').remove()
      if (this.$('.currency').length) {
        this.$('.currency').hide()
      }

      _.each(this.$('.order-item.gift-item .special-discount-listing li'), (li, index) => {
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
    this.$('#quantityTotal strong').html(html)

    this.updateCart(e)
  }

  updateGiftPriceWithTimelinePromotion(quantity, amount) {
    console.log('GiveGiftMembership updateGiftPrice')
    let total = (parseInt(quantity, 10) * parseFloat(amount)).toFixed(2)

    if (this.model.has('DiscountRate')) {
      // const giftItem = this.model.get('DiscountRate')
      //   .find(({ count }) => count === parseInt(quantity, 10))
      // total = (parseInt(quantity, 10) * parseFloat(giftItem.Amount)).toFixed(2)
      total = this.timelinePromotionTotal(quantity, amount)
      // debugger
    }

    return total
  }

  updateCart(e) {
    console.log('GiveGiftMembership updateCart')
    const quantity = e.target.value
    if (quantity > 0) {
      const { amount } = this.gifting.get('gift')
      const total = this.timelinePromotionTotal(quantity, amount) // (quantity * amount).toFixed(2)
      const gift = {
        quantity: Number(quantity),
        amount,
        total: parseFloat(total),
      }
      this.cart.set({ gift }, { context: this })
    } else {
      this.cart.unset('gift', { silent: true })
    }
    console.log(this.model.attributes)
  }

  timelinePromotionTotal(quantity, amount) {
    if (this.model.has('DiscountRate')) {
      const specialDiscount = this.model.get('DiscountRate')
      const toCalculateElements = _.reject(
        specialDiscount,
        (element) => (element.count > quantity),
      )
      console.log(toCalculateElements)
      // debugger
      let total = 0
      /* eslint arrow-body-style: 0 */
      /* eslint no-return-assign: 0 */
      toCalculateElements.forEach((element) => {
        return total += parseFloat(element.Amount)
      })
      // debugger
      total = (Math.round(total * 100) / 100)
      console.log(total)
      // debugger
      return total.toFixed(2)
    }

    return (quantity, amount).toFixed(2)
  }
}

export default GiveGiftMembership
