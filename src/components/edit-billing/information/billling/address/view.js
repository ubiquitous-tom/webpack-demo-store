import { View } from 'backbone'
import _ from 'underscore'

import Popup from 'shared/elements/popup'

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

    this.popup = new Popup({ model: this.model, i18n: this.i18n })

    this.listenTo(this.model, 'editBilling:undelegateEvents', () => {
      console.log('EditBillingInformationBillingAddress garbageCollect')
      this.remove()
      // debugger
    })

    this.listenTo(this.editBillingInformationBillingAddressModel, 'change:countries', (model, value) => {
      console.log(model, value)
      // debugger
      const optionsEls = this.countriesDropdown()
      this
        .$('#billingcountry')
        .html(optionsEls)

      this.selectDefaultCountry()
    })

    this.listenTo(this.model, 'editBillingValidation:address', (paymentInfo) => {
      console.log(paymentInfo)
      // debugger
      const firstNameEl = this.$('#firstname')
      firstNameEl.focus().blur()
      if (_.isEmpty(firstNameEl.val()) || firstNameEl[0].checkValidity() === false) {
        this.popup.render()
        this.popup.setModelBody(this.i18n.t(firstNameEl.data('message')))
        this.model.trigger('editBillingValidation:formError', firstNameEl.data('message'))
        return
      }

      const lastNameEl = this.$('#lastname')
      lastNameEl.focus().blur()
      if (_.isEmpty(lastNameEl.val()) || lastNameEl[0].checkValidity() === false) {
        this.popup.render()
        this.setModelBody(this.i18n.t(lastNameEl.data('message')))
        this.model.trigger('editBillingValidation:formError', lastNameEl.data('message'))
        return
      }

      const countryEl = this.$('#billingcountry')
      countryEl.focus().blur()
      if (_.isEmpty(countryEl.val()) || countryEl[0].checkValidity() === false) {
        this.popup.render()
        this.setModelBody(this.i18n.t(countryEl.data('message')))
        this.model.trigger('editBillingValidation:formError', countryEl.data('message'))
        return
      }

      const zipEl = this.$('#billingzip')
      zipEl.focus().blur()
      if (_.isEmpty(zipEl.val()) || zipEl[0].checkValidity() === false) {
        this.popup.render()
        this.setModelBody(this.i18n.t(zipEl.data('message')))
        this.model.trigger('editBillingValidation:formError', zipEl.data('message'))
        return
      }
      // debugger
      // We need to set this to use later for not Guest account and No account customers
      this.model.set({
        editBillingForm: {
          address_zip: zipEl.val(),
          address_country: countryEl.val(),
        },
      })

      const billingAddress = {
        BillingAddress: {
          Name: [
            firstNameEl.val(),
            lastNameEl.val(),
          ].join(' '),
          Country: countryEl.val(),
          Zip: zipEl.val(),
        },
      }
      const paymentInfoNew = { ...paymentInfo, ...billingAddress }
      // debugger
      const isLoggedIn = this.model.has('Session') ? this.model.get('Session').LoggedIn : false
      if (!isLoggedIn) {
        this.model.trigger('editBillingValidation:email', paymentInfoNew)
      } else {
        this.model.trigger('editBillingValidation:paymentMethod', paymentInfoNew)
      }
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
    const el = this.$(`#${id}`)
    if (_.isEmpty(value) || validationMessage) {
      el.parent('.form-group').removeClass('has-success').addClass('has-error')
      this.popup.render()
      this.popup.setBodyContent(this.i18n.t(el.data('message')))
      isValidated = false
    } else {
      el.parent('.form-group').removeClass('has-error')
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
    this.$(`#billingcountry option[value="${billingCountry}"]`).prop('selected', true)
  }
}

export default EditBillingInformationBillingAddress
