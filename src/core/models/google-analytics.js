import { Model } from 'backbone'

class GoogleAnalytics extends Model {
  initialize() {
    console.log('GoogleAnalytics initialize')
    // // Google Analytics (w/o Google Tag Manager)
    // if (typeof _gaq != 'undefined') {
    //   console.log('No Google Analytics (w/o Google Tag Manager)')
    // }
    // Universal Analytics (w/o Google Tag Manager)
    if (typeof ga != 'undefined') {
      console.log('No Universal Analytics (w/o Google Tag Manager)')
    }
  }

  /* eslint eqeqeq: 0 */
  /* eslint no-undef: 0 */
  logEvent(category, action, label, value = null) {
    // // Google Analytics (w/o Google Tag Manager)
    // if (typeof _gaq != 'undefined') {
    //   _gaq.push(['_trackEvent', category, action, label, value])
    // }
    // Universal Analytics (w/o Google Tag Manager)
    if (typeof ga != 'undefined') {
      if (value !== null) {
        ga('send', 'event', category, action, label, value)
      } else {
        ga('send', 'event', category, action, label)
      }
    }
  }

  logPageView(page) {
    // Universal Analytics (w/o Google Tag Manager)
    if (typeof ga != 'undefined') {
      // Send to GA as `/aboutUs` per this suggestion
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications
      ga('set', 'page', page)
      ga('send', 'pageView')
    }
  }
}

export default GoogleAnalytics
