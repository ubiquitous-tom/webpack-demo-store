import ATVModel from 'core/model'
import StripePlans from 'core/models/stripe-plans'

class AccountInfoModel extends ATVModel {
  initialize() {
    console.log('AccountInfoModel initialize')

    this.stripePlans = new StripePlans()
    this.stripePlans.on('change:stripePlans', (model, value) => {
      console.log(model, value)
      this.set({
        stripePlans: value,
        stripePlansCountry: model.get('stripePlansCountry'),
        stripePlansLang: model.get('stripePlansLang'),
      })
      // debugger
    })

    this.stripePlans.on('change:annualStripePlan', (model, value) => {
      console.log(model, value)
      this.set('annualStripePlan', value)
      // debugger
    })

    this.stripePlans.on('change:monthlyStripePlan', (model, value) => {
      console.log(model, value)
      this.set('monthlyStripePlan', value)
      // debugger
    })
  }

  getJoinedDate() {
    console.log('AccountInfoModel getJoinedDate')
    const joinDate = this.get('Customer').JoinDate
    const joinDateObj = Date.parse(joinDate)
    console.log(joinDateObj)
    const dynamicDate = new Date(joinDateObj)
    console.log(dynamicDate, `${this.get('stripePlansLang')}-${this.get('stripePlansCountry')}`)
    const joinedDate = dynamicDate.toLocaleDateString(
      `${this.get('stripePlansLang')}-${this.get('stripePlansCountry')}`,
      {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
    )
    this.set({ joinedDate })
    return joinedDate
  }
}

export default AccountInfoModel
