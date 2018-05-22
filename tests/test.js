const { AhungryAround } = require('../index')
const { HelloWorld } = require('./HelloWorld')

const handler = {
  apply: (target, thisArg, argumentsList) => {
    const key = `${target.name} ${JSON.stringify(argumentsList)}`

    console.log('Begin: ', key)

    const result = target.apply(thisArg, argumentsList)

    console.log('End: ', key)

    return result
  }
}

const aa = new AhungryAround(module, handler)
aa.init()

const hw = new HelloWorld()
hw.flub('Greetings')
HelloWorld.blub('Salutations')
