import { Model } from 'backbone'
import _ from 'underscore'

class ReviewModel extends Model {
  // get defaults() {
  //   return {
  //     Session: {
  //       SessionID: '4739a38e-a897-4665-a19c-15609c89f4bc',
  //     },
  //     Gift: [{
  //       Quantity: '1',
  //       Amount: '66.99',
  //       CurrencyDesc: 'USD',
  //     }],
  //     Membership: {
  //       Type: 'MONTHLY',
  //       Amount: '6.99',
  //       CurrencyDesc: 'USD',
  //       PlanID: 'ATV-MON-USD-699',
  //     },
  //   }
  // }

  get url() {
    return '/purchase'
  }

  initialize() {
    console.log('ReviewModel initialize')
  }

  submit(model) {
    console.log('ReviewModel submit')
    const cart = model.get('cart')
    const gifting = model.get('gifting')

    const monthly = cart.getItemQuantity('monthly')
    const annual = cart.getItemQuantity('annual')
    const promoCode = model.has('membershipPromo') ? model.get('membershipPromo').PromotionCode : ''
    let membershipType = 'monthly'
    if (monthly > 0) {
      membershipType = 'monthly'
    }
    if (annual > 0) {
      membershipType = 'annual'
    }
    debugger
    let attributes = {
      Session: {
        SessionID: model.get('Session').SessionID,
      },
      Gift: [{
        Quantity: cart.getItemQuantity('gift'),
        Amount: cart.getItemAmount('gift'),
        CurrencyDesc: gifting.get('gift').CurrencyDesc,
      }],
      Membership: {
        Type: membershipType.toUpperCase(),
        Amount: cart.getItemAmount(membershipType),
        CurrencyDesc: gifting.get('gift').CurrencyDesc,
        PlanID: model.get(`${membershipType}StripePlan`).PlanID,
        AutoRenew: false,
        PromoCode: promoCode,
      },
    }

    attributes = this.timelinePromotion(attributes, model)

    const options = {
      dataType: 'json',
      ajaxSync: true,
      wait: true,
      success: this.success,
      error: this.error,
    }
    console.log(attributes, options)
    debugger
    this.save(attributes, options)
  }

  success(model, resp, options) {
    console.log('ReviewModel success')
    console.log(model, resp, options)

    const { message } = resp
    model.set({
      purchaseSuccess: true,
      type: 'success',
      message,
    })
  }

  error(model, resp, options) {
    console.log('ReviewModel error')
    console.log(model, resp, options)
    // debugger
    let message = ''
    /* eslint function-paren-newline: 0 */
    resp
      .then(
        (response) => {
          console.log(response.responseJSON, response.responseText)
          if (!_.isEmpty(response.responseJSON)) {
            message = response.responseJSON.message
            return message
          }
          if (!_.isEmpty(response.responseText)) {
            message = response.responseText
            return message
          }
          return message
        },
        (error) => {
          console.log(error.responseJSON, error.responseText)
          if (!_.isEmpty(error.responseJSON)) {
            message = error.responseJSON.error
            return message
          }
          if (!_.isEmpty(error.responseText)) {
            message = error.responseText
            return message
          }
          return message
        })
      .always(() => {
        model.set({
          purchaseSuccess: false,
          message,
        })
      })
  }

  timelinePromotion(attributes, model) {
    const cart = model.get('cart')
    const gifting = model.get('gifting')
    debugger
    // Timeline Promotion (2020).
    if (model.has('DiscountRate')) {
      debugger
      const specialDiscount = model.get('DiscountRate')
      // attributes.Gift = []
      const qty = cart.getItemQuantity('gift')
      const defaultCurrency = gifting.get('gift').CurrencyDesc
      let giftTotalCount = 0
      specialDiscount.forEach((discount, index) => {
        const amount = parseFloat(discount.Amount, 10).toFixed(2)
        let quantity = 1

        // get out when we reach the same cart quantity
        if (giftTotalCount >= qty) {
          return
        }

        // get each gift pricing amount and quantity
        if (!_.isEmpty(attributes.Gift)) {
          attributes.Gift.forEach((gift) => {
            if (gift.Amount === amount) {
              quantity += 1
              // gift.Quantity += 1
            }
          })
        }

        if (quantity <= 1) {
          if (index < qty) {
            const gift = {
              Quantity: quantity,
              Amount: amount,
              CurrencyDesc: defaultCurrency,
            }
            attributes.Gift.push(gift)
          }
        }
        giftTotalCount += 1
      })
    }

    return attributes
  }
}

export default ReviewModel
