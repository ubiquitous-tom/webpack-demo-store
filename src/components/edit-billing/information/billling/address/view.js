import { View } from 'backbone'
import _ from 'underscore'

import './stylesheet.scss'
import template from './index.hbs'

import EditBillingInformationBillingAddressModel from './model'

class EditBillingInformationBillingAddress extends View {
  get el() {
    return '#billingAddressContainer'
  }

  get template() {
    return template
  }

  get events() {
    return {
      'input input#firstname': 'validate',
      'blur input#firstname': 'validate',
      'input input#lastname': 'validate',
      'blur input#lastname': 'validate',
      'input select#billingcountry': 'validate',
      'blur select#billingcountry': 'validate',
      'input input#billingzip': 'validate',
      'blur input#billingzip': 'validate',
    }
  }

  initialize(options) {
    console.log('EditBillingInformationBillingAddress initialize')
    this.i18n = options.i18n
    this.editBillingInformationBillingAddressModel = new EditBillingInformationBillingAddressModel()

    this.listenTo(this.model, 'editBilling:undelegateEvents', () => {
      console.log('EditBillingInformationBillingAddress garbageCollect')
      this.remove()
      // debugger
    })

    this.listenTo(this.editBillingInformationBillingAddressModel, 'change:countries', (model, value) => {
      console.log(model, value)
      // debugger
      const optionsEls = this.countriesDropdown()
      this.$el
        .find('#billingcountry')
        .html(optionsEls)

      this.selectDefaultCountry()
    })

    this.listenTo(this.model, 'editBillingValidation:address', (paymentInfo, context) => {
      console.log(paymentInfo, context)
      // debugger
      if (
        this.$el.find('#firstname')[0].checkValidity()
        && this.$el.find('#lastname')[0].checkValidity()
        && this.$el.find('#billingcountry')[0].checkValidity()
        && this.$el.find('#billingzip')[0].checkValidity()
      ) {
        this.model.set({
          editBillingForm: {
            address_zip: this.$el.find('#billingzip').val(),
            address_country: this.$el.find('#billingcountry').val(),
          },
        })
        // let paymentInfo = model.get('paymentInfo')
        const billingAddress = {
          BillingAddress: {
            Name: [this.$el.find('#firstname').val(), this.$el.find('#lastname').val()].join(' '),
            Country: this.$el.find('#billingcountry').val(),
            Zip: this.$el.find('#billingzip').val(),
          },
        }
        const paymentInfoNew = { ...paymentInfo, ...billingAddress }
        // debugger
        // model.set({
        //   paymentInfo,
        // })
        // debugger
        const isLoggedIn = (this.model.has('Session') ? this.model.get('Session').LoggedIn : false)
        if (!isLoggedIn) {
          this.model.trigger('editBillingValidation:email', paymentInfoNew, context)
        } else {
          this.model.trigger('editBillingValidation:paymentMethod', paymentInfoNew, context)
        }
      }
      // else {
      //   context.$el.find('#firstname')[0].addEventListener('invalid', (e) => {
      //     console.log(e)
      //     context.$el.find('#firstname')[0].closest('.form-group').classList.add('has-error')
      //   }, false)
      //   context.$el.find('#lastname')[0].addEventListener('invalid', (e) => {
      //     console.log(e)
      //     context.$el.find('#firstname')[0].closest('.form-group').classList.add('has-error')
      //   }, false)
      //   context.$el.find('#billingcountry')[0].addEventListener('invalid', (e) => {
      //     console.log(e)
      //     context.$el.find('#firstname')[0].closest('.form-group').classList.add('has-error')
      //   }, false)
      //   context.$el.find('#billingzip')[0].addEventListener('invalid', (e) => {
      //     console.log(e)
      //     context.$el.find('#firstname')[0].closest('.form-group').classList.add('has-error')
      //   }, false)
      // }
    })

    this.render()
  }

  render() {
    console.log('EditBillingInformationBillingAddress render')
    console.log(this.model.attributes)
    // debugger
    const name = this.model.has('Customer')
      ? this.model.get('Customer')?.Name
      : ''
    const [firstName, lastName] = !_.isEmpty(name) ? name.split(/(?<=^\S+)\s/) : ['', '']
    // const countries = this.countriesDropdown()
    const postalCode = this.model.get('BillingAddress')?.PostalCode
    const attributes = {
      firstName,
      lastName,
      // countries,
      postalCode,
    }
    const html = this.template(attributes)
    this.$el.html(html)

    // this.selectDefaultCountry()

    return this
  }

  validate(e) {
    const {
      id,
      value,
      validity,
      validationMessage,
    } = e.target
    console.log('validate', id, value, validity, validationMessage)
    let isValidated = true
    if (_.isEmpty(value) || validationMessage) {
      this.$el.find(`#${id}`).parent('.form-group').removeClass('has-success').addClass('has-error')
      isValidated = false
    } else {
      this.$el.find(`#${id}`).parent('.form-group').removeClass('has-error')
    }

    return isValidated
  }

  countriesDropdown() {
    let options = `<option value="">${this.i18n.t('DROPDOWN-COUNTRY')}</option>`
    const countries = this.editBillingInformationBillingAddressModel.get('countries')
    _.each(countries, (country) => {
      options += `<option value="${country.abbr}">${country.name}</option>`
    })

    return options
  }

  selectDefaultCountry() {
    const billingCountry = this.model.get('BillingAddress')?.Country
    this.$el.find(`#billingcountry option[value="${billingCountry}"]`).prop('selected', true)
  }
}

export default EditBillingInformationBillingAddress
