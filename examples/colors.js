#!/usr/bin/env node
import { red, brightRed, color, ANSIescape, ANSIresetCode } from '../src/Badger.js'
import { range } from '@abw/badger-utils'

const green = color('green');
const darkRed = color('dark red');
const whiteOnRed = color({ bg: 'red', fg: 'white' });
const orange = color('#ff7f00')
const lime = color('64,232,64')
const skyblue = color('0 128 255')
const whiteOnBlue = color({ fg: '200,200,255', bg: '#007fff' })

console.log(red('some red text'));
console.log(red('some ', 'red', ' text'));
console.log(brightRed('some bright red text'));
console.log(darkRed('some dark red text'));
console.log(green('some green'));
console.log(whiteOnRed('some white text on a red background'));
console.log(whiteOnBlue('some (near) white text on an RGB blue background'));
console.log(orange('orange'), lime('lime'), skyblue('skyblue'));

for (let x = 0; x < 256; x += 16) {
  const str = range(0, 31).map(
    n => ANSIescape({ bg: `${n * 8}, ${x}, ${(31 - n) * 8}`}) + ' '
  ).join('')
  console.log(str + ANSIresetCode);
}
