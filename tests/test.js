const { AhungryAround } = require('../index')
const { HelloWorld } = require('./HelloWorld')

let iter = 0

const handler = {
  apply: (target, thisArg, argumentsList) => {
    // A sample useful key value.
    const key = `${target.name} ${JSON.stringify(argumentsList)}`

    console.log('This is the nth time calling handler:', ++iter)
    const result = target.apply(thisArg, argumentsList)

    return result
  }
}

const aa = new AhungryAround(module, handler)
aa.init()

const hw = new HelloWorld()
hw.flub('Greetings')
HelloWorld.blub()

if (iter !== 4) throw new Error('Test failure!' + iter)
