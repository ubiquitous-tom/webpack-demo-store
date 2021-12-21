import globalContext from './global-context'

class BackBoneContext {
  constructor() {
    this.context = globalContext.context
  }

  getContext() {
    return this.context
  }

  setContext(newContext) {
    console.log(this.context, newContext)
    this.context.push(newContext)
    console.log(this.context, newContext)
  }
}

export default BackBoneContext
