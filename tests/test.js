const { AhungryAround } = require('../index')
const { HelloWorld } = require('./HelloWorld')
const { Printer } = require('./HWPrinter')

let iter = 0
let uiter = 0

const handler = {
  apply: (target, thisArg, argumentsList) => {
    // A sample useful key value.
    const key = `${target.name} ${JSON.stringify(argumentsList)}`
    console.log(`This is the nth time (${++iter}) calling handler, from ${key}`)
    const result = target.apply(thisArg, argumentsList)

    return result
  }
}

// Maybe you want a handler to just work on one class?
const handler2 = {
  apply: (target, thisArg, argumentsList) => {
    const key = `${target.name} ${JSON.stringify(argumentsList)}`
    console.log(`This is the nth time (${++uiter}) calling upcase handler, from ${key}`)

    argumentsList = argumentsList.map(arg => arg.toUpperCase())
    let result = target.apply(thisArg, argumentsList)

    return result
  }
}

const a2 = new AhungryAround(handler2, 'Uppercase')
a2.handleObjectOrFn(Printer)

const aa = new AhungryAround(handler, 'Iterator')
aa.handleModule(module)

const hw = new HelloWorld()
hw.flub('Greetings')
HelloWorld.blub()

if (iter !== 4) throw new Error('Test failure!' + iter)
