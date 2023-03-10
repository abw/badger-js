# Miscellaneous Functions

- [ANSI Colors](#ansi-colors)
- [Debugging](#debugging)
- [Exit](#exit)
- [App Status](#app-status)
- [Progress](#progress)

## ANSI Colors

The [color()](function#static-function-color) function provides a simple way
to use ANSI escape codes to generate colored text.

It is super-simple and only exists in here from a time in the past when
[chalk](https://www.npmjs.com/package/chalk) didn't play nicely with ESM
modules.  It looks like it does now, so if you want anything more than the
basic 16 ANSI colours, with `bright` and/or `bold` options then you should
use [chalk](https://www.npmjs.com/package/chalk).

*My apologies to the Europeans, Canadians and others who know that the
correct spelling is "colour", but I have reluctantly come to accept that
the "programming" spelling used in CSS, etc., is "color".**

There are functions defined for the basic colors:

* `black()`
* `red()`
* `green()`
* `yellow()`
* `blue()`
* `magenta()`
* `cyan()`
* `grey()`
* `white()`

And also for the "bright" variants:

* `brightBlack()`
* `brightRed()`
* `brightGreen()`
* `brightYellow()`
* `brightBlue()`
* `brightMagenta()`
* `brightCyan()`
* `brightGrey()`
* `brightWhite()`

And the "dark" variants:

* `darkBlack()`
* `darkRed()`
* `darkGreen()`
* `darkYellow()`
* `darkBlue()`
* `darkMagenta()`
* `darkCyan()`
* `darkGrey()`
* `darkWhite()`

```js
import { red } from '@abw/badger'

console.log(red('some red text'));
```

These are all implemented in terms of the [color()](function#static-function-color)
function which accepts a string containing the color name along with an optional
`bright` or `dark` prefix.

```js
import { color } from '@abw/badger'

const brightRed = color('bright red');

console.log(brightRed('some bright red text'));
```

You can also pass an option containing separate colors for the foreground
(`fg`) and background (`bg`).

```js
const whiteOnRed = color({ bg: 'red', fg: 'white' });
console.log(whiteOnRed('some white text on a red background'));
```

## Debugging

The [Debugger()](function#static-function-Debugger) function returns a
debugging function.  The first argument is a flag which determines if
debugging is enabled.  If this is `true` then the function will act as a
wrapper around `console.log`.  If it is false then it is an alias for the
[doNothing()](function#static-function-doNothing) function which, as the
name suggests, does nothing.

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
by the [color()](function#static-function-color) described above.

```js
const debugColor = Debugger(true, 'DEBUG > ', 'bright cyan');
debugColor('This message will have a bright cyan prefix');
```

The [addDebug()](function#static-function-addDebug) function takes an object
reference as the first argument, followed by the same three options as for
the [Debugger()](function#static-function-Debugger) function.
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

```js
const myObj = new MyClass({ debug: true, debugPrefix: 'MyClass > ' });
myObj.someMethod();
```

With this configuration a debugging message will be printed:

```
MyClass > Hello World!
```

## Exit

The [exit()](function#static-function-exit) function exits the current
process.  It is a trivial wrapper around `process.exit()`.

The first argument is an exit code (0 for a sucessful exit,
any other value to indicate an exceptional condition).  The second
optional argument can be a message to display before exiting.

```js
import { exit } from '@abw/badger'

exit(0, 'Goodbye')
```

The [quit()](function#static-function-quit) function is a wrapper around
the [exit()](function#static-function-exit) function that sets the exit code
to 0 to indicate successful termination.

```js
import { quit } from '@abw/badger'

quit('Goodbye')
```

The [abort()](function#static-function-abort) function is a wrapper around
the [exit()](function#static-function-exit) function that sets the exit
code to 1 to indicate an error condition.

```js
import { abort } from '@abw/badger'

abort('Big plate of failed')
```

## App Status

The [appStatus()](function#static-function-appStatus) function is a simple
wrapper around a function to either print a success message, or catch any
errors thrown and display the error message.

```js
import { prompt, appStatus } from '../src/Badger.js';

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

```
✔ Enter an even number … 2
✓ You entered 2
```

If an error is thrown then the error message will be displayed in bright
red.

```
✔ Enter an even number … 3
✗ 3 is not an even number
```

## Progress

The [progress()](function#static-function-progress) function returns an
object which can be used to give a visual display of the progress of a long
running process.  It is intended to be used in cases where you know in advance
how many actions you need to complete (e.g. importing 1000 records into a
database).

```js
import { progress } from '@abw/badger'

const records = [
  // lots of records
]
const p = progress(records.length);

for (record of records) {
  // do something with record
  p.printProgress();
}
```

The `printProgress()` method accepts an argument which is the number of
items you have processed in that loop (i.e. it's the delta, not the total
number processed so far).  It defaults to 1.

As the method is called it will print a few more "pixels" to the screen to
display a nice colourful image of an hourglass.  I can't show you the pretty
colours here, so I suggest you run the [examples/progress.js](examples/progress.js)
script to see for yourself.

```
┌────────────────────────────────────────────────────────────────┐
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙ ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● ∙∙ │
│ ∙∙ ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● ∙∙ │
│ ∙∙ ●● ◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦ ●● ∙∙ │
│ ∙∙ ●● ◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦ ●● ∙∙ │
│ ∙∙∙ ●● ◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦ ●● ∙∙∙ │
│ ∙∙∙∙ ●● ◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦ ●● ∙∙∙∙ │
│ ∙∙∙∙∙ ●● ◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦ ●● ∙∙∙∙∙ │
│ ∙∙∙∙∙∙ ●● ◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦ ●● ∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙ ●● *◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦* ●● ∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙ ●● **◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦** ●● ∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙ ●● *****◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦***** ●● ∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● *******◦◦◦◦◦◦◦◦◦◦******* ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● ****************** ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● ************ ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● ****** ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● **** ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● **** ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● **** ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● ◦****◦ ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● ◦◦◦◦****◦◦◦◦ ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● ◦◦◦◦◦◦◦****◦◦◦◦◦◦◦ ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● ◦◦◦◦◦◦◦◦◦******◦◦◦◦◦◦◦◦◦ ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙ ●● ◦◦◦◦◦◦◦◦◦◦◦********◦◦◦◦◦◦◦◦◦◦◦ ●● ∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙ ●● ◦◦◦◦◦◦◦◦◦◦◦************◦◦◦◦◦◦◦◦◦◦◦ ●● ∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙ ●● ◦◦◦◦◦◦◦◦◦◦******************◦◦◦◦◦◦◦◦◦◦ ●● ∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙ ●● ◦◦◦◦◦◦◦◦◦************************◦◦◦◦◦◦◦◦◦ ●● ∙∙∙∙∙∙ │
│ ∙∙∙∙∙ ●● ◦◦◦◦◦◦◦******************************◦◦◦◦◦◦◦ ●● ∙∙∙∙∙ │
│ ∙∙∙∙ ●● ◦◦◦◦◦************************************◦◦◦◦◦ ●● ∙∙∙∙ │
│ ∙∙∙ ●● ◦◦◦◦****************************************◦◦◦◦ ●● ∙∙∙ │
│ ∙∙ ●● ◦◦◦********************************************◦◦◦ ●● ∙∙ │
│ ∙∙ ●● ◦◦**********************************************◦◦ ●● ∙∙ │
│ ∙∙ ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● ∙∙ │
│ ∙∙ ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● ∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
└────────────────────────────────────────────────────────────────┘
```

You can change the colours or use your own picture.  See the
[examples/progress.js](examples/progress.js) file for examples.

