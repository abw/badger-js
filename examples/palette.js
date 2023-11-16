#!/usr/bin/env node
import { palette } from '../src/Badger.js'

const status = palette({
  valid: 'bright green',
  invalid: 'bright red',
  comment: 'cyan'
})

console.log(
  status.valid('This is valid')
);

console.log(
  status.invalid('This is invalid')
);

console.log(
  status.comment('This is a comment')
);
