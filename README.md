# Ahungry Around

Project page:

https://github.com/ahungry/ahungry-around

A nodejs library for easily wrapping an entire codebase in a custom
Proxy handler
(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

See a sample in tests/test.js:

```js
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
```

Which will produce output as such:

```sh
$ node ./tests/test.js
This is the nth time calling handler: 1
Greetings
This is the nth time calling handler: 2
Greetings
This is the nth time calling handler: 3
blub
This is the nth time calling handler: 4
blub
```


# License

GPLv3
