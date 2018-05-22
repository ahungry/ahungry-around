class Printer {
  log (msg) {
    return console.log(msg)
  }
}

// fixme: This type of bind doesn't seem to work, boo.
// module.exports.printer = console.log.bind(console.log)

module.exports = { Printer }
