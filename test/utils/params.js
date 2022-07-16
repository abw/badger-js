import test from 'ava';
import { requiredParam, requiredParams, allParams, anyParams } from '../../src/Badger.js';

// requiredParam()
test(
  'requiredParam with value',
  t => t.is(requiredParam({ foo: 123 }, 'foo'), 123)
);
test(
  'requiredParam without value',
  t => {
    const error = t.throws( () => requiredParam({ foo: 123 }, 'bar') );
    t.is( error.message, "Missing value for required parameter: bar")
  }
);

// requiredParams()
test(
  'requiredParams with all values',
  t => {
    const [foo, bar] = requiredParams({ foo: 123, bar: 456}, 'foo bar');
    t.is(foo, 123);
    t.is(bar, 456);
  }
);
test(
  'requiredParams with missing value',
  t => {
    const error = t.throws( () => requiredParams({ foo: 123 }, 'foo bar') );
    t.is( error.message, "Missing value for required parameter: bar")
  }
);

// allParams() is an alias for requiredParams()
test(
  'allParams with all values',
  t => {
    const [foo, bar] = allParams({ foo: 123, bar: 456}, 'foo bar');
    t.is(foo, 123);
    t.is(bar, 456);
  }
);
test(
  'allParams with missing value',
  t => {
    const error = t.throws( () => allParams({ foo: 123 }, 'foo bar') );
    t.is( error.message, "Missing value for required parameter: bar")
  }
);

// anyParams()
test(
  'anyParams with all values',
  t => {
    const [foo, bar] = anyParams({ foo: 123, bar: 456, baz: 789}, 'foo bar');
    t.is(foo, 123);
    t.is(bar, 456);
  }
);
test(
  'anyParams with one value',
  t => {
    const [foo, bar] = anyParams({ foo: 123 }, 'foo bar');
    t.is(foo, 123);
    t.is(bar, undefined);
  }
);
test(
  'anyParams with no values',
  t => {
    const error = t.throws( () => anyParams({ wiz: 123, waz: 456 }, 'foo bar baz') );
    t.is( error.message, "Missing value for one of: foo, bar or baz")
  }
);

