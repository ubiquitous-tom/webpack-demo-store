import _ from 'underscore'
import globalContext from './global-context'

class BackBoneContext {
  constructor() {
    console.log('BackBoneContext constructor')
    this.context = globalContext.context
  }

  getContext(currentContext) {
    console.log('BackBoneContext getContext')
    console.log(this.context, currentContext, this.context[currentContext])
    return this.context[currentContext]
  }

  setContext(newContext) {
    console.log('BackBoneContext setContext')
    console.log(this.context, newContext)
    // this.context.push(newContext)
    _.extend(this.context, newContext)
    console.log(this.context, newContext)
  }
}

export default BackBoneContext
