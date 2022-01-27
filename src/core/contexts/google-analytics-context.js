import { Model } from 'backbone'
import GoogleAnalytics from '../models/google-analytics'
import BackBoneContext from './backbone-context'

class GoogleAnalyticsContext extends Model {
  initialize() {
    console.log('GoogleAnalyticsContext initialize')
    console.log(this.attributes)
    const initializeApp = this.attributes
    console.log(initializeApp.model.attributes)
    const ga = new GoogleAnalytics(initializeApp.model.attributes)
    this.context = new BackBoneContext()
    this.context.setContext({ ga })
    console.log(this.context)
  }
}

export default GoogleAnalyticsContext
