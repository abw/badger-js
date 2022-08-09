import test from 'ava';
import { timestamp } from '../../src/Badger/Timestamp.js'

test(
  'year() method',
  t => {
    const stamp = timestamp('2022-08-09 01:02:03');
    t.is( stamp.year(), 2022 );
    t.is( stamp.year(2023), 2023 );
    t.is( stamp.year(), 2023 );
    t.is( stamp.date(), '2023-08-09' );
  }
);
test(
  'month() method',
  t => {
    const stamp = timestamp('2022-08-09 01:02:03');
    t.is( stamp.month(), 8 );
    t.is( stamp.month(10), 10 );
    t.is( stamp.month(), 10 );
    t.is( stamp.date(), '2022-10-09' );
  }
);
test(
  'day() method',
  t => {
    const stamp = timestamp('2022-08-09 01:02:03');
    t.is( stamp.day(), 9 );
    t.is( stamp.day(10), 10 );
    t.is( stamp.day(), 10 );
    t.is( stamp.date(), '2022-08-10' );
  }
);
test(
  'hours() method',
  t => {
    const stamp = timestamp('2022-08-09 01:02:03');
    t.is( stamp.hours(), 1 );
    t.is( stamp.hours(4), 4 );
    t.is( stamp.hours(), 4 );
    t.is( stamp.time(), '04:02:03' );
  }
);
test(
  'minutes() method',
  t => {
    const stamp = timestamp('2022-08-09 01:02:03');
    t.is( stamp.minutes(), 2 );
    t.is( stamp.minutes(4), 4 );
    t.is( stamp.minutes(), 4 );
    t.is( stamp.time(), '01:04:03' );
  }
);
test(
  'seconds() method',
  t => {
    const stamp = timestamp('2022-08-09 01:02:03');
    t.is( stamp.seconds(), 3 );
    t.is( stamp.seconds(4), 4 );
    t.is( stamp.seconds(), 4 );
    t.is( stamp.time(), '01:02:04' );
  }
);
test(
  'Date getTime() method',
  t => {
    const d = new Date("1970-01-01");
    t.is( d.getTime(), 0 );
  }
);
test(
  'dateObject() method',
  t => {
    const stamp = timestamp('1970-01-02');
    const date  = stamp.dateObject();
    t.is( date.getTime(), 86400000 );
  }
);
test(
  'milliseconds() method',
  t => {
    const stamp = timestamp('1970-01-02');
    t.is( stamp.milliseconds(), 86400000 );
  }
);
test(
  'epochSeconds() method',
  t => {
    const stamp = timestamp('1970-01-02');
    t.is( stamp.epochSeconds(), 86400 );
  }
);
