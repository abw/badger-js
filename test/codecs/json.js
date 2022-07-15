import test from 'ava';
import { codec } from '../../src/Badger.js';

const json = codec('json');

test(
  'json codec encode() function',
  t => t.is(json.encode([1, 2, 3]), "[1,2,3]")
);
test(
  'json codec decode() function',
  t => t.is(json.decode("[99,100]")[0], 99)
);
