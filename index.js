// Bind a handler to everything possible.
class AhungryAround {
  // module should be a nodejs module object.
  // handler should be an appropriate Proxy handler.
  constructor (module, handler) {
    this.module = module
    this.handler = handler

    // Ensure all maps/callbacks work with proper binding.
    this.init = this.init.bind(this)
    this.getProps = this.getProps.bind(this)
    this.handleAll = this.handleAll.bind(this)
    this.handleModuleChildren = this.handleModuleChildren.bind(this)
  }

  init () {
    this.module.children.map(this.handleModuleChildren)
  }

  getProps (classDef) {
    if (classDef === undefined || classDef === null) return

    const props = Object.getOwnPropertyNames(classDef)

    return props.filter(key => ['length', 'prototype', 'name'].indexOf(key) === -1)
  }

  // Pull all props, bind the handler to it.
  handleAll (ClassDef) {
    const props = this.getProps(ClassDef) || []
    const protoProps = this.getProps(ClassDef.prototype) || []

    props.map(prop => {
      const proxy = new Proxy(ClassDef[prop], this.handler)
      ClassDef[prop] = proxy
    })

    protoProps.map(prop => {
      const proxy = new Proxy(ClassDef.prototype[prop], this.handler)
      ClassDef.prototype[prop] = proxy
    })

    return [...props, ...protoProps]
  }

  // Pull all the modules we use, and bind the handlers.
  handleModuleChildren (child) {
    if (/node_modules/.test(child.id)) return

    // Recurse into their children as well.
    child.children.map(this.handleModuleChildren)

    const exports = child.exports

    if (typeof exports === 'function') {
      this.handleAll(exports)
    }

    if (typeof exports === 'object') {
      Object.keys(exports).map(key => this.handleAll(exports[key]))
    }
  }
}

module.exports.AhungryAround = AhungryAround
