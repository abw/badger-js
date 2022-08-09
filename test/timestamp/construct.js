import test from 'ava';
import { timestamp } from '../../src/Badger/Timestamp.js'

test(
  'no value is now',
  t => {
    const now = new Date();
    // let's hope the time doesn't roll over a second/minute/hour...
    const stamp = timestamp();
    t.is( stamp.parts.year, now.getFullYear() );
    t.is( stamp.parts.month, now.getMonth() + 1 );
    t.is( stamp.parts.day, now.getDate() );
    t.is( stamp.parts.hours, now.getHours() );
    t.is( stamp.parts.minutes, now.getMinutes() );
    t.is( stamp.parts.seconds, now.getSeconds() );
  }
);

test(
  'date object',
  t => {
    const now = new Date();
    const stamp = timestamp(now);
    t.is( stamp.parts.year, now.getFullYear() );
    t.is( stamp.parts.month, now.getMonth() + 1 );
    t.is( stamp.parts.day, now.getDate() );
    t.is( stamp.parts.hours, now.getHours() );
    t.is( stamp.parts.minutes, now.getMinutes() );
    t.is( stamp.parts.seconds, now.getSeconds() );
  }
);

test(
  'timestamp string constructor',
  t => {
    const stamp = timestamp('2022/08/09 01:02:03');
    t.is( stamp.parts.year, 2022 );
    t.is( stamp.parts.month, 8 );
    t.is( stamp.parts.day, 9 );
    t.is( stamp.parts.hours, 1 );
    t.is( stamp.parts.minutes, 2 );
    t.is( stamp.parts.seconds, 3 );
  }
);

test(
  'timestamp copy constructor',
  t => {
    const stamp1 = timestamp('2022/08/09 01:02:03');
    const stamp2 = timestamp(stamp1);
    t.is( stamp2.parts.year, 2022 );
    t.is( stamp2.parts.month, 8 );
    t.is( stamp2.parts.day, 9 );
    t.is( stamp2.parts.hours, 1 );
    t.is( stamp2.parts.minutes, 2 );
    t.is( stamp2.parts.seconds, 3 );
    t.is( stamp1.year(2023), 2023 );
    t.is( stamp2.year(), 2022 );
  }
);

test(
  'date string constructor',
  t => {
    const stamp = timestamp('9 August 2022 22:23:24');
    t.is( stamp.parts.year, 2022 );
    t.is( stamp.parts.month, 8 );
    t.is( stamp.parts.day, 9 );
    t.is( stamp.parts.hours, 22 );
    t.is( stamp.parts.minutes, 23 );
    t.is( stamp.parts.seconds, 24 );
  }
);

test(
  'object constructor',
  t => {
    const stamp = timestamp({
      year: 2022, month: 8, day: 9,
      hours: 9, minutes: 16, seconds: 23
    });
    t.is( stamp.parts.year, 2022 );
    t.is( stamp.parts.month, 8 );
    t.is( stamp.parts.day, 9 );
    t.is( stamp.parts.hours, 9 );
    t.is( stamp.parts.minutes, 16 );
    t.is( stamp.parts.seconds, 23 );
  }
);

test(
  'integer millseconds',
  t => {
    const date = new Date('9 August 2022 22:23:24');
    const ms   = date.getTime();
    const stamp = timestamp(ms);
    t.is( stamp.parts.year, 2022 );
    t.is( stamp.parts.month, 8 );
    t.is( stamp.parts.day, 9 );
    t.is( stamp.parts.hours, 22 );
    t.is( stamp.parts.minutes, 23 );
    t.is( stamp.parts.seconds, 24 );
  }
);

test(
  'ms millseconds',
  t => {
    const date = new Date('9 August 2022 22:23:24');
    const ms   = date.getTime();
    const stamp = timestamp({ ms });
    t.is( stamp.parts.year, 2022 );
    t.is( stamp.parts.month, 8 );
    t.is( stamp.parts.day, 9 );
    t.is( stamp.parts.hours, 22 );
    t.is( stamp.parts.minutes, 23 );
    t.is( stamp.parts.seconds, 24 );
  }
);

test(
  'unix seconds',
  t => {
    const date = new Date('9 August 2022 22:23:24');
    const secs = Math.floor(date.getTime() / 1000);
    const stamp = timestamp({ unix: secs });
    t.is( stamp.parts.year, 2022 );
    t.is( stamp.parts.month, 8 );
    t.is( stamp.parts.day, 9 );
    t.is( stamp.parts.hours, 22 );
    t.is( stamp.parts.minutes, 23 );
    t.is( stamp.parts.seconds, 24 );
  }
);
