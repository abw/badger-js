import test from 'ava';
import { parseDate, unpackDate } from '../../src/Badger/Timestamp.js'

//-----------------------------------------------------------------------------
// Date object
//-----------------------------------------------------------------------------
test(
  'unpack a Date object',
  t => {
    const now = new Date();
    const stamp = unpackDate(now);
    t.is( stamp.year, now.getFullYear() );
    t.is( stamp.month, now.getMonth() + 1 );
    t.is( stamp.day, now.getDate() );
    t.is( stamp.hours, now.getHours() );
    t.is( stamp.minutes, now.getMinutes() );
    t.is( stamp.seconds, now.getSeconds() );
  }
);

test(
  'split a Date string',
  t => {
    const stamp = parseDate('9 August 2022 22:23:24');
    t.is( stamp.year, 2022 );
    t.is( stamp.month, 8 );
    t.is( stamp.day, 9 );
    t.is( stamp.hours, 22 );
    t.is( stamp.minutes, 23 );
    t.is( stamp.seconds, 24 );
  }
);

