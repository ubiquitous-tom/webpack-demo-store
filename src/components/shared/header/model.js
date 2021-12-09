import { Model, LocalStorage } from 'backbone'
import _ from 'underscore'
// import docCookies from 'doc-cookies'
import { getLocalStorage } from 'backbone.localstorage/src/utils'

class HeaderModel extends Model {
  get defaults() {
    return {
      localStorageID: 'atv-initializeapp',
    }
  }

  initialize() {
    console.log('HeaderModel initialize')
    this.localStorage = new LocalStorage(this.get('localStorageID'))
    // console.log(this, this.LocalStorage)
    const storage = getLocalStorage(this)
    // console.log(storage)
    if (!_.isEmpty(storage.records)) {
      const content = this.getStorageContent()
      this.set(content)
    } else {
      // go to login
    }
  }

  getStorageContent() {
    console.log('HeaderModel getStorageContent')
    const id = this.localStorage._getItem(this.get('localStorageID'))
    // console.log(id)
    const name = this.localStorage._itemName(id)
    // console.log(name)
    const item = this.localStorage._getItem(name)
    // console.log(item)
    const storage = this.localStorage.serializer.deserialize(item)
    // console.log(storage)

    return storage
  }
}

export default HeaderModel

/*
{
    BillingAddress: {
        LastModifiedBy: "AddressServlet",
        LastModifiedDate: 1623941714725,
        Type: "BILLING",
        CreatedBy: "Session Trigger",
        StripeCountryCode: "US",
        Region: "CA",
        PostalCode: "92705",
        Country: "US",
        City: "Tustin",
        PostalCodeStatus: "created"
    },
    Streaming: {
        Exceeded: false,
        Count: 0,
        Limit: 15
    },
    Customer: {
        CurrSymbol: "$",
        webPaymentEdit: true,
        Email: "subin.shrestha@amcnetworks.com",
        StripeEnabled: true,
        FirstName: "",
        StripeCustomerID: "cus_IPOu2a9s46ejoG",
        CustomerID: "acorn-589fff15-a62f-450b-ab10-7b5b0ddda397",
        LastName: "",
        CurrencyDesc: "USD",
        JoinDate: "06/17/2021",
        Name: "Subin Shrestha"
    },
    Actions: [{
        Type: "PromotionNotifyAction",
        ClickAction: "",
        Priority: "Normal",
        Exclusive: "false",
        Image: "freeshipping_ad",
        callToAction: ""
    }],
    RecommendedAction: {
        Type: "Signout"
    },
    Membership: {
        Status: "ACTIVE",
        VatAmount: 0,
        Renewable: false,
        PromoCode: "ACORN33OFF3",
        Vat: false,
        Store: "ATV2",
        Term: "Annual",
        TermUnits: "12",
        NextBillingDate: "06/24/2024",
        Type: "PREMIUM",
        SubscriptionAmount: 59.99,
        NextBillingDateAsLong: 1719258303027,
        TaxAmount: 0,
        NextBillingAmount: 59.99,
        NetAmount: 59.99,
        Cancelable: false
    },
    PaymentMethod: {
        ExpirationDate: "12/2028",
        Expired: false,
        LastFour: "4444"
    },
    Roles: [
        "Admin",
        "CSR",
        "Read",
        "SuperAdmin",
        "Write"
    ],
    Subscription: {
        Status: "TRIAL",
        OnHold: false,
        Trial: true,
        Monthly: false,
        Expired: false,
        AnnualDiscount: true,
        Gift: false,
        Type: "ANNUAL",
        Annual: true,
        Promo: true,
        Weekly: false,
        NoSubscription: false,
        MonthlyDiscount: false,
        Canceled: false,
        Paused: false
    },
    Session: {
        SignupRestricted: false,
        Country: "US",
        LoggedIn: true,
        SessionID: "24e94e6e-3a30-416b-a430-3d03e80944a6"
    }
}
*/
