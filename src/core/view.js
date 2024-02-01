import { View } from 'backbone'
// import _ from 'underscore'

// import Workspace from '../routers/router'

class ATVView extends View {
  initialize(options) {
    console.log('ATVView initialize')
    console.log(this, options)
    this.model = options.model
    this.i18n = options.i18n
    // this.router = new Workspace({ model: this.model, i18n: this.i18n })

    this.setAllowedGifting()
  }

  render() {
    console.log('ATVView render')
    // debugger
    return this
  }

  setAllowedGifting() {
    const cloudFrontCountryHeader = this.model.get('stripePlansCountry')
    let groupName = this.model.get('groupName') || 'United States'
    // debugger
    switch (cloudFrontCountryHeader) {
      case 'AU':
      case 'NZ':
        groupName = 'Australia'
        break
      case 'CA':
        groupName = 'Canada'
        break
      case 'FK':
      case 'GB':
      case 'GG':
      case 'GI':
      case 'IM':
      case 'JE':
      case 'MT':
        groupName = 'United Kingdom'
        break
      case 'AS':
      case 'GU':
      case 'MH':
      case 'PR':
      case 'UM':
      case 'US':
      case 'USMIL':
      case 'VI':
        groupName = 'United States'
        break
      default:
        groupName = ''
    }

    const isGroupNameAllowedGifting = (groupName.length)
    const isGroupNameUK = (groupName === 'United Kingdom')
    const isGroupNameAU = (groupName === 'Australia')
    const isAllowedGifting = (groupName.length) ? 'true' : 'false'
    const isUK = (groupName === 'United Kingdom') ? 'true' : 'false'
    const isAU = (groupName === 'Australia') ? 'true' : 'false'

    this.model.set({
      isGroupNameAllowedGifting,
      isGroupNameUK,
      isGroupNameAU,
      isAllowedGifting,
      isUK,
      isAU,
    })
  }
}

export default ATVView
