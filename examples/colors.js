#!/usr/bin/env node
import { red, brightRed, color } from '../src/Badger.js'

const green = color('green');
const darkRed = color('dark red');
const whiteOnRed = color({ bg: 'red', fg: 'white' });

console.log(red('some red text'));
console.log(red('some ', 'red', ' text'));
console.log(brightRed('some bright red text'));
console.log(darkRed('some dark red text'));
console.log(green('some green'));
console.log(whiteOnRed('some white text on a red background'));
