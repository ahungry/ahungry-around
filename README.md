# Ahungry Around

Project page:

https://github.com/ahungry/ahungry-around

A nodejs library for easily and recursively wrapping an entire codebase in a custom
Proxy handler
(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

# Goal

To help allow global invocations of Aspect Oriented Programming (AOP),
such as profiling or logging etc.

# Usage

See a sample in tests/test.js:

```js
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
```

Which will produce output as such:

```sh
$ node ./tests/test.js
This is the nth time (1) calling handler, from flub ["Greetings"]
Greetings
This is the nth time (2) calling handler, from log ["Greetings"]
This is the nth time (1) calling upcase handler, from log
["Greetings"]
GREETINGS
This is the nth time (3) calling handler, from blub []
blub
This is the nth time (4) calling handler, from log ["blub"]
This is the nth time (2) calling upcase handler, from log ["blub"]
BLUB
```


# License

GPLv3
