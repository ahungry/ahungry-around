const { Printer } = require('./HWPrinter')
const myPrinter = new Printer()

// fixme: Again, doesn't work on bound functions for some reason.
const printer = myPrinter.log.bind(myPrinter)

class HelloWorld {
  static blub () {
    printer('blub')
    myPrinter.log('blub')
  }

  flub (msg) {
    printer(msg)
    myPrinter.log(msg)
  }
}

module.exports = { HelloWorld }
