import { Model } from 'backbone'
import _ from 'underscore'

// import { LocalStorage } from 'backbone'
// import { getLocalStorage } from 'backbone.localstorage/src/utils'

class EditBillingInformationBillingAddressModel extends Model {
  get defaults() {
    return {
      localStorageID: 'atv-countries',
      states: [
        {
          abbr: 'AK',
          name: 'Alaska',
        },
        {
          abbr: 'AL',
          name: 'Alabama',
        },
        {
          abbr: 'AR',
          name: 'Arkansas',
        },
        {
          abbr: 'AZ',
          name: 'Arizona',
        },
        {
          abbr: 'CA',
          name: 'California',
        },
        {
          abbr: 'CO',
          name: 'Colorado',
        },
        {
          abbr: 'CT',
          name: 'Connecticut',
        },
        {
          abbr: 'DC',
          name: 'Dist. Of Columbia',
        },
        {
          abbr: 'DE',
          name: 'Delaware',
        },
        {
          abbr: 'FL',
          name: 'Florida',
        },
        {
          abbr: 'GA',
          name: 'Georgia',
        },
        {
          abbr: 'HI',
          name: 'Hawaii',
        },
        {
          abbr: 'IA',
          name: 'Iowa',
        },
        {
          abbr: 'ID',
          name: 'Idaho',
        },
        {
          abbr: 'IL',
          name: 'Illinois',
        },
        {
          abbr: 'IN',
          name: 'Indiana',
        },
        {
          abbr: 'KS',
          name: 'Kansas',
        },
        {
          abbr: 'KY',
          name: 'Kentucky',
        },
        {
          abbr: 'LA',
          name: 'Louisiana',
        },
        {
          abbr: 'MA',
          name: 'Massachusetts',
        },
        {
          abbr: 'MD',
          name: 'Maryland',
        },
        {
          abbr: 'ME',
          name: 'Maine',
        },
        {
          abbr: 'MI',
          name: 'Michigan',
        },
        {
          abbr: 'MN',
          name: 'Minnesota',
        },
        {
          abbr: 'MO',
          name: 'Missouri',
        },
        {
          abbr: 'MS',
          name: 'Mississippi',
        },
        {
          abbr: 'MT',
          name: 'Montana',
        },
        {
          abbr: 'NC',
          name: 'North Carolina',
        },
        {
          abbr: 'ND',
          name: 'North Dakota',
        },
        {
          abbr: 'NE',
          name: 'Nebraska',
        },
        {
          abbr: 'NH',
          name: 'New Hampshire',
        },
        {
          abbr: 'NJ',
          name: 'New Jersey',
        },
        {
          abbr: 'NM',
          name: 'New Mexico',
        },
        {
          abbr: 'NV',
          name: 'Nevada',
        },
        {
          abbr: 'NY',
          name: 'New York',
        },
        {
          abbr: 'OH',
          name: 'Ohio',
        },
        {
          abbr: 'OK',
          name: 'Oklahoma',
        },
        {
          abbr: 'OR',
          name: 'Oregon',
        },
        {
          abbr: 'PA',
          name: 'Pennsylvania',
        },
        {
          abbr: 'RI',
          name: 'Rhode Island',
        },
        {
          abbr: 'SC',
          name: 'South Carolina',
        },
        {
          abbr: 'SD',
          name: 'South Dakota',
        },
        {
          abbr: 'TN',
          name: 'Tennessee',
        },
        {
          abbr: 'TX',
          name: 'Texas',
        },
        {
          abbr: 'UT',
          name: 'Utah',
        },
        {
          abbr: 'VA',
          name: 'Virginia',
        },
        {
          abbr: 'VT',
          name: 'Vermont',
        },
        {
          abbr: 'WA',
          name: 'Washington',
        },
        {
          abbr: 'WI',
          name: 'Wisconsin',
        },
        {
          abbr: 'WV',
          name: 'West Virginia',
        },
        {
          abbr: 'WY',
          name: 'Wyoming',
        },
        {
          abbr: 'AB',
          name: 'Alberta',
        },
        {
          abbr: 'BC',
          name: 'British Columbia',
        },
        {
          abbr: 'MB',
          name: 'Manitoba',
        },
        {
          abbr: 'NB',
          name: 'New Brunswick',
        },
        {
          abbr: 'NL',
          name: 'Newfoundland',
        },
        {
          abbr: 'NS',
          name: 'Nova Scotia',
        },
        {
          abbr: 'ON',
          name: 'Ontario',
        },
        {
          abbr: 'PE',
          name: 'Prince Edward Isle',
        },
        {
          abbr: 'QC',
          name: 'Quebec',
        },
        {
          abbr: 'SK',
          name: 'Saskatchewan',
        },
        {
          abbr: 'NT',
          name: 'Northwest Territories',
        },
        {
          abbr: 'YT',
          name: 'Yukon',
        },
        {
          abbr: 'NU',
          name: 'Nunavut',
        },
        {
          abbr: 'AS',
          name: 'American Samoa',
        },
        {
          abbr: 'GU',
          name: 'Guam',
        },
        {
          abbr: 'PR',
          name: 'Puerto Rico',
        },
        {
          abbr: 'VI',
          name: 'Virgin Islands (U.S.)',
        },
        {
          abbr: 'AP',
          name: 'AP',
        },
        {
          abbr: 'AA',
          name: 'AA',
        },
        {
          abbr: 'AE',
          name: 'AE',
        },
        {
          abbr: 'FN',
          name: 'FN',
        },
      ],
      countries: [],
      Name: '',
      PostalCode: '',
      Country: '',
    }
  }

  urlRoot() {
    const env = this.environment()
    return `https://${env}api.rlje.net/cms/admin/countrycode`
  }

  initialize() {
    console.log('EditBillingInformationBillingAddressModel initialize')
    // this.localStorage = new LocalStorage(this.get('localStorageID'))
    // const storage = getLocalStorage(this)
    // console.log(storage, this)
    // if (_.isEmpty(this.getStorageContent(this.localStorageID))) {
    this.fetch({
      ajaxSync: true,
    })
    // }
  }

  parse(resp) {
    console.log('EditBillingInformationBillingAddressModel parse')
    const countries = []

    _.each(resp, (country) => {
      countries.push({
        abbr: country.CountryCode,
        name: country.CountryName,
      })
    })

    const abbr = countries.map((country) => (country.abbr))
    const caIndex = abbr.indexOf('CA')
    const usIndex = abbr.indexOf('US')
    countries.unshift(countries.splice(caIndex, 1)[0])
    countries.unshift(countries.splice(usIndex, 1)[0])

    this.set({
      countries,
    })

    return resp
  }

  environment() {
    const env = process.env.RLJE_API_ENVIRONMENT || ''
    // console.log(env)
    return env
  }

  // getStorageContent() {
  //   console.log('EditBillingInformationBillingAddressModel getStorageContent')
  //   debugger
  //   const id = this.localStorage._getItem(this.get('localStorageID'))
  //   // console.log(id)
  //   const name = this.localStorage._itemName(id)
  //   // console.log(name)
  //   const item = this.localStorage._getItem(name)
  //   // console.log(item)
  //   const storage = this.localStorage.serializer.deserialize(item)
  //   // console.log(storage)

  //   return storage
  // }

  // updateModel() {
  //   console.log('EditBillingInformationBillingAddressModel updateModel')
  //   const storage = this.getStorageContent()
  //   // console.log(storage)
  //   this.set(storage)
  // }
}

export default EditBillingInformationBillingAddressModel
