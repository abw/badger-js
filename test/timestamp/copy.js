import test from 'ava';
import { timestamp } from '../../src/Badger/Timestamp.js'

test(
  'timestamp copy',
  t => {
    const stamp = timestamp('2022/08/09 01:02:03');
    const copy  = stamp.copy();
    t.is( copy.parts.year, 2022 );
    t.is( copy.parts.month, 8 );
    t.is( copy.parts.day, 9 );
    t.is( copy.parts.hours, 1 );
    t.is( copy.parts.minutes, 2 );
    t.is( copy.parts.seconds, 3 );
  }
);