import { Model } from 'backbone'
import _ from 'underscore'

class EditBillingInformationBillingAddressModel extends Model {
  get defaults() {
    return {
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
    this.fetch({
      ajaxSync: true,
    })
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
    let env = ''
    if (window.location.hostname.indexOf('dev') > -1) {
      env = 'dev3-'
    }
    if (window.location.hostname.indexOf('qa') > -1) {
      env = 'qa-'
    }
    if (process.env.NODE_ENV === 'development') {
      env = process.env.RLJE_API_ENVIRONMENT
    }
    // console.log(env)
    return env
  }
}

export default EditBillingInformationBillingAddressModel
