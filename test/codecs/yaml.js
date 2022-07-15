import test from 'ava';
import { codec } from '../../src/Badger.js';

const yaml = codec('yaml');

test(
  'yaml codec loaded',
  t => t.is( typeof yaml.encode, 'function')
);
test(
  'yaml codec encode() function',
  t => t.is(yaml.encode([1, 2, 3]), "- 1\n- 2\n- 3\n")
);
test(
  'yaml codec decode() function',
  t => t.is(yaml.decode("msg: Hello World").msg, "Hello World")
);

