//import test from 'ava';
import { escape, reset } from '../../src/Badger/Utils/Color.js'

console.log(
  '%sbg:dark blue, fg:bright yellow%s',
  escape({ bg: 'dark blue', fg: 'bright yellow' }),
  reset()
);
console.log(
  '%sfg:blue%s',
  escape({ fg: 'blue' }),
  reset()
);
console.log(
  '%sfg:dark blue%s',
  escape({ fg: 'dark blue' }),
  reset()
);
console.log(
  '%sfg:bright blue%s',
  escape({ fg: 'bright blue' }),
  reset()
);
console.log(
  '%sHello %sWorld%s! How are you?',
  // escape({ fg: 'bold red' }),
  '',
  escape({ bg: 'blue', fg: 'bright yellow' }),
  reset()
);


//test(
//  'isString() identifies string',
//  t => t.is(isString("foo"), true)
//);