import test from 'ava';
import { splitTimestamp } from '../../src/Badger/Timestamp.js'

//-----------------------------------------------------------------------------
// date
//-----------------------------------------------------------------------------
test(
  'split a date with hypens',
  t => {
    const date = splitTimestamp('2022-08-09');
    t.is( date.year, 2022 );
    t.is( date.month, 8 );
    t.is( date.day, 9 );
  }
);
test(
  'split a date with hypens and double digit numbers',
  t => {
    const date = splitTimestamp('2022-10-11');
    t.is( date.year, 2022 );
    t.is( date.month, 10 );
    t.is( date.day, 11 );
  }
);
test(
  'split a date with slashes',
  t => {
    const date = splitTimestamp('2022/08/09');
    t.is( date.year, 2022 );
    t.is( date.month, 8 );
    t.is( date.day, 9 );
  }
);
test(
  'split a date with short numbers',
  t => {
    const date = splitTimestamp('2022/8/9');
    t.is( date.year, 2022 );
    t.is( date.month, 8 );
    t.is( date.day, 9 );
  }
);

//-----------------------------------------------------------------------------
// date and time
//-----------------------------------------------------------------------------
test(
  'split a date and time with space',
  t => {
    const date = splitTimestamp('2022-09-10 1:22:23 ');
    t.is( date.year, 2022 );
    t.is( date.month, 9 );
    t.is( date.day, 10 );
    t.is( date.hours, 1 );
    t.is( date.minutes, 22 );
    t.is( date.seconds, 23 );
  }
);
test(
  'split a date and time with T',
  t => {
    const date = splitTimestamp('2022-09-10T1:22:23');
    t.is( date.year, 2022 );
    t.is( date.month, 9 );
    t.is( date.day, 10 );
    t.is( date.hours, 1 );
    t.is( date.minutes, 22 );
    t.is( date.seconds, 23 );
  }
);
