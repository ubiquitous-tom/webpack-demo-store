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

    this.listenTo(this.editBillingInformationBillingAddressModel, 'change:countries', (model, value) => {
      console.log(model, value)
      // debugger
      const optionsEls = this.countriesDropdown()
      this.$el
        .find('#billingcountry')
        .html(optionsEls)

      this.selectDefaultCountry()
    })

    this.listenTo(this.model, 'editBillingValidation:address', (model, context) => {
      console.log(model, context)
      // debugger
      if (
        context.$el.find('#firstname')[0].checkValidity()
        && context.$el.find('#lastname')[0].checkValidity()
        && context.$el.find('#billingcountry')[0].checkValidity()
        && context.$el.find('#billingzip')[0].checkValidity()
      ) {
        model.set({
          editBillingForm: {
            address_zip: context.$el.find('#billingzip').val(),
            address_country: context.$el.find('#billingcountry').val(),
          },
        })
        let paymentInfo = model.get('paymentInfo')
        const billingAddress = {
          BillingAddress: {
            Name: [context.$el.find('#firstname').val(), context.$el.find('#lastname').val()].join(' '),
            Country: context.$el.find('#billingcountry').val(),
            Zip: context.$el.find('#billingzip').val(),
          },
        }
        paymentInfo = { ...paymentInfo, ...billingAddress }
        // debugger
        model.set({
          paymentInfo,
        })
        // debugger
        model.trigger('editBillingValidation:email', model, context)
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
    const [firstName, lastName] = name.split(/(?<=^\S+)\s/)
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
