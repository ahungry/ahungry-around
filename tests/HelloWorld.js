const { Printer } = require('./HWPrinter')
const myPrinter = new Printer()

// fixme: Again, doesn't work on bound functions for some reason.
const printer = myPrinter.log.bind(myPrinter)

class HelloWorld {
  get myVar () {
    return this._myVar + 1
  }

  static blub () {
    printer('blub')
    myPrinter.log('blub')
  }

  constructor () {
    this._myVar = 3
  }

  flub (msg) {
    printer(msg)
    myPrinter.log(msg)
  }
}

module.exports = { HelloWorld }
