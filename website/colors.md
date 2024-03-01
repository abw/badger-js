---
outline: deep
---
# ANSI Colors

The `color()` function provides a simple way to use ANSI escape codes to
generate colored text.

It is quite simple and only exists in here from a time in the past when
[chalk](https://www.npmjs.com/package/chalk) didn't play nicely with ESM
modules.  It looks like it does now, so you might want to use that instead.

*My apologies to the Europeans, Canadians and others who know that the
correct spelling is "colour", but I have reluctantly come to accept that
the "programming" spelling used in CSS, etc., is "color".**

## Color Functions

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

## color()

These are all implemented in terms of the `color()`
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

You can also define colors using RGB triples.  The argument should be a string
containing three numbers (each from 0 to 255), separated by commas and/or
whitespace.

```js
const lightBlue = color('0 128 255'); // or '0,128,255' or '0, 138, 255'
console.log(lightblue('some light blue text'));
```

Or you can use an RGB hex string.

```js
const orange = color('#ff7f00');
console.log(orange('some orange text'));
```

Both formats can be used to set foreground and background colors.

```js
const whiteOnBlue = color({ fg: '200,200,255', bg: '#007fff' })
console.log(whiteOnBlue('some (near) white text on blue'));
```

## palette()

The `palette()` function allows you to create a palette of "semantic"
colors using the above.

```js
const status = palette({
  valid:   'bright green',
  invalid: 'bright red',
  comment: 'cyan'
})
```

Using this you can render text in different colors using semantic names.

```js
console.log(
  status.valid('This is valid')
);

console.log(
  status.invalid('This is invalid')
);

console.log(
  status.comment('This is a comment')
);
```

