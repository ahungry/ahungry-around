// Keep a global reference of all things we've already bound, to avoid duplicates.
const handlerMap = {}

// Bind a handler to everything possible.
class AhungryAround {
  // handler should be an appropriate Proxy handler.
  constructor (handler, desc) {
    this.handler = handler
    this.desc = desc
    this.seenIds = []

    // Ensure all maps/callbacks work with proper binding.
    this.handleModule = this.handleModule.bind(this)
    this.getProps = this.getProps.bind(this)
    this.handleObjectOrFn = this.handleObjectOrFn.bind(this)
    this.handleModuleChildren = this.handleModuleChildren.bind(this)
  }

  // module should be a nodejs module object.
  handleModule (module) {
    module.children.map(this.handleModuleChildren)
  }

  getProps (classDef) {
    if (classDef === undefined || classDef === null) return

    const props = Object.getOwnPropertyNames(classDef)

    return props.filter(key => ['arguments', 'length', 'prototype', 'name'].indexOf(key) === -1)
  }

  // Pull all props, bind the handler to it.
  handleObjectOrFn (ClassDef) {
    // See if we've already worked on this or not.
    const mapKey = this.desc + ClassDef.name
    if (handlerMap[mapKey] !== undefined) {
      return
    }

    handlerMap[mapKey] = true

    const props = this.getProps(ClassDef) || []
    const protoProps = ClassDef && ClassDef.prototype ? this.getProps(ClassDef.prototype) || [] : []

    props.map(prop => {
      if (typeof ClassDef[prop] !== 'object' || ClassDef[prop] === null) return

      const proxy = new Proxy(ClassDef[prop], this.handler)
      ClassDef[prop] = proxy
    })

    protoProps.map(prop => {
      if (typeof ClassDef.prototype[prop] !== 'object' || ClassDef.prototype[prop] === null) return

      const proxy = new Proxy(ClassDef.prototype[prop], this.handler)
      ClassDef.prototype[prop] = proxy
    })

    return [...props, ...protoProps]
  }

  // Pull all the modules we use, and bind the handlers.
  handleModuleChildren (child) {
    if (/node_modules/.test(child.id)) return

    if (this.seenIds.indexOf(child.id) > -1) return

    this.seenIds.push(child.id)

    // Recurse into their children as well.
    child.children.map(this.handleModuleChildren)

    const exports = child.exports

    if (typeof exports === 'function') {
      this.handleObjectOrFn(exports)
    }

    if (typeof exports === 'object') {
      Object.keys(exports).map(key => this.handleObjectOrFn(exports[key]))
    }
  }
}

module.exports.AhungryAround = AhungryAround
