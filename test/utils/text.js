import test from 'ava';
import {
  capitalise, snakeUp,
  splitList, joinList, joinListAnd, joinListOr
} from '../../src/Badger.js'

// capitalise
test(
  'capitalise foo => Foo',
  t => t.is(capitalise('foo'), 'Foo')
);
test(
  'capitalise FOO => Foo',
  t => t.is(capitalise('FOO'), 'Foo')
);

// snakeUp
test(
  'snakeUp foo => Foo',
  t => t.is(snakeUp('foo'), 'Foo')
);
test(
  'snakeUp foo_bar => FooBar',
  t => t.is(snakeUp('foo_bar'), 'FooBar')
);
test(
  'snakeUp foo_bar/baz_waz => FooBar/BazWaz',
  t => t.is(snakeUp('foo_bar/baz_waz'), 'FooBar/BazWaz')
);

// splitList
test(
  'splitList text with spaces',
  t => {
    const list = splitList("foo bar   baz\twiz\nwaz\t \n \t  \nwoz");
    t.is( list.length, 6);
    t.is( list[0], 'foo');
    t.is( list[1], 'bar');
    t.is( list[2], 'baz');
    t.is( list[3], 'wiz');
    t.is( list[4], 'waz');
    t.is( list[5], 'woz');
  }
)
test(
  'splitList text with commas',
  t => {
    const list = splitList("foo,bar, baz,\twiz,\nwaz,\t \n \t  \nwoz");
    t.is( list.length, 6);
    t.is( list[0], 'foo');
    t.is( list[1], 'bar');
    t.is( list[2], 'baz');
    t.is( list[3], 'wiz');
    t.is( list[4], 'waz');
    t.is( list[5], 'woz');
  }
)

// joinList
test(
  'joinList with default spaces',
  t => t.is(joinList(["foo", "bar", "baz"]), "foo bar baz")
)
test(
  'joinList with commas',
  t => t.is(joinList(["foo", "bar", "baz"], ", "), "foo, bar, baz")
)
test(
  'joinList with commas and "and"',
  t => t.is(joinList(["foo", "bar", "baz"], ", ", " and "), "foo, bar and baz")
)
test(
  'joinListAnd',
  t => t.is(joinListAnd(["foo", "bar", "baz"]), "foo, bar and baz")
)
test(
  'joinListOr',
  t => t.is(joinListOr(["foo", "bar", "baz"]), "foo, bar or baz")
)
