import test from 'ava';
import { isString, isArray, isUndefined, isNull, hasValue, noValue } from '../../src/Badger.js'

// isString()
test(
  'isString() identifies string',
  t => t.is(isString("foo"), true)
);
test(
  'isString() identifies number',
  t => t.is(isString(123), false)
);
test(
  'isString() identifies undefined',
  t => t.is(isString(), false)
);

// isArray()
test(
  'isArray() identifies arrays',
  t => t.is(isArray([1,2,3]), true)
);
test(
  'isArray() identifies non-arrays',
  t => t.is(isArray(123), false)
);
test(
  'isArray() identifies null',
  t => t.is(isArray(null), false)
);

// isUndefined()
test(
  'isUndefined identifies undefined',
  t => t.is(isUndefined(undefined), true)
);
test(
  'isUndefined identifies null',
  t => t.is(isUndefined(null), false)
);
test(
  'isUndefined identifies nothing',
  t => t.is(isUndefined(), true)
);

// isNull()
test(
  'isNull identifies undefined',
  t => t.is(isNull(undefined), false)
);
test(
  'isNull identifies null',
  t => t.is(isNull(null), true)
);
test(
  'isNull identifies nothing',
  t => t.is(isNull(), false)
);

// hasValue()
test(
  'hasValue identifies nothing = false',
  t => t.is(hasValue(), false)
);
test(
  'hasValue identifies undefined = false',
  t => t.is(hasValue(undefined), false)
);
test(
  'hasValue identifies null = false',
  t => t.is(hasValue(null), false)
);
test(
  'hasValue identifies false = true',
  t => t.is(hasValue(false), true)
);
test(
  'hasValue identifies 0 = true',
  t => t.is(hasValue(0), true)
);

// noValue()
test(
  'noValue identifies nothing = true',
  t => t.is(noValue(), true)
);
test(
  'noValue identifies undefined = true',
  t => t.is(noValue(undefined), true)
);
test(
  'noValue identifies null = true',
  t => t.is(noValue(null), true)
);
test(
  'noValue identifies false = false',
  t => t.is(noValue(false), false)
);
test(
  'noValue identifies 0 = true',
  t => t.is(noValue(0), false)
);
