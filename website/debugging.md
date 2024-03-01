---
outline: deep
---
# Debugging

When I write code it always runs first time and never has any bugs.
But I'm also a pathological liar.  Here are some function to make debugging
your code a little easier.

## Debugger() {#Debugger}

The `Debugger()` function returns a
debugging function.  The first argument is a flag which determines if
debugging is enabled.  If this is `true` then the function will act as a
wrapper around `console.log`.  If it is false then it is an alias for the
[`doNothing()`](https://abw.github.io/badger-utils/misc.html#doNothing)
function which, as the name suggests, does nothing.

```js
import { Debugger } from '@abw/badger'

const debugOn  = Debugger(true);
const debugOff = Debugger(false);

debugOn('This message will be displayed: %s', 'Hello World!');
debugOff('This message will be NOT be displayed: %s', 'Hello World!');
```

The second argument is an optional prefix for debugging messages.

```js
const debugPrefix = Debugger(true, 'DEBUG > ');
debugPrefix('This message will have a prefix');
```

The message will be displayed as:

```
DEBUG > This message will have a prefix
```

The third option is a color.  This can be any of the color options supported
by the [`color()`](colors#color) function.

```js
const debugColor = Debugger(true, 'DEBUG > ', 'bright cyan');
debugColor('This message will have a bright cyan prefix');
```

## addDebug() {#addDebug}

The `addDebug()` function takes an object reference as the first argument,
followed by the same three options as for the [`Debugger()`](#Debugger) function.
It adds the debugging function as the `debug` method in the object.

It can be used in the constructor method for an object like this:

```js
import { addDebug } from '@abw/badger'

class MyClass {
  constructor(options={}) {
    addDebug(this, options.debug, options.debugPrefix, options.debugColor);
  }
  someMethod() {
    this.debug('Hello World!')
  }
}
```

Now you can enable debugging message in your class by passing a `debug` flag,
and optionally, a `debugPrefix` or `debugColor` parameter, to the constructor.

```js{2-3}
const myObj = new MyClass({
  debug: true,
  debugPrefix: 'MyClass > '
});
myObj.someMethod();
```

With this configuration a debugging message will be printed:

```bash
MyClass > Hello World!
```

## appStatus() {#appStatus}

The `appStatus()` function is a simple wrapper around a function to either
print a success message, or catch any errors thrown and display the error
message.

```js
import { prompt, appStatus } from '@abw/badger';

const app = appStatus(
  async () => {
    const n = await prompt('Enter an even number');
    if (n % 2) {
      throw `${n} is not an even number`
    }
    return `You entered ${n}`;
  }
)

app();
```

If the function is successful it should return a message which will be
displayed to the user (in bright green, although you can't see that here).

```bash
✔ Enter an even number … 2
✓ You entered 2
```

If an error is thrown then the error message will be displayed in bright
red.

```bash
✔ Enter an even number … 3
✗ 3 is not an even number
```
