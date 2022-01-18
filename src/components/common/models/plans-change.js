import { Model } from 'backbone'

class PlansChange extends Model {
  get url() {
    return '/acorn/plans/change'
  }

  initialize() {
    console.log('PlansChange initialize')

    // this.on('error', (model, resp, options) => {
    //   console.log(model, resp, options)
    //   debugger
    //   console.log(options.context)
    //   options.context.trigger('error', model, resp, options)
    // })
  }

  parse(resp) {
    console.log('PlansChange parse')

    return resp
  }
}

export default PlansChange
