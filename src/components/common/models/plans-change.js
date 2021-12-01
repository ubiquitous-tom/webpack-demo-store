import { Model } from 'backbone'

class PlansChange extends Model {

  get url() {
    return '/acorn/plans/change'
  }

  initialize() {
    console.log('PlansChange initialize')
  }

  parse(resp) {
    console.log('PlansChange parse')

    return resp
  }
}

export default PlansChange
