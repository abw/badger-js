import test from 'ava';
import hello from '../src/badger/hello.js';
import sayHello from '../src/badger.js';

sayHello();
test('foo', t => {
  t.pass();
});
