import test from 'ava';
import { parseDuration, singularDurations } from '../../src/Badger/Timestamp.js'

test(
  'parseDuration("1 year")',
  t => {
    const d = parseDuration('1 year');
    t.is( d.year, 1 );
  }
);
test(
  'parseDuration("2 years")',
  t => {
    const d = parseDuration('2 years');
    t.is( d.year, 2 );
  }
);
test(
  'parseDuration("1 month")',
  t => {
    const d = parseDuration('1 month');
    t.is( d.month, 1 );
  }
);
test(
  'parseDuration("2 months")',
  t => {
    const d = parseDuration('2 months');
    t.is( d.month, 2 );
  }
);
test(
  'parseDuration("1 day")',
  t => {
    const d = parseDuration('1 day');
    t.is( d.day, 1 );
  }
);
test(
  'parseDuration("2 days")',
  t => {
    const d = parseDuration('2 days');
    t.is( d.day, 2 );
  }
);
test(
  'parseDuration("1 hour")',
  t => {
    const d = parseDuration('1 hour');
    t.is( d.hour, 1 );
  }
);
test(
  'parseDuration("2 hours")',
  t => {
    const d = parseDuration('2 hours');
    t.is( d.hour, 2 );
  }
);
test(
  'parseDuration("1 minute")',
  t => {
    const d = parseDuration('1 minute');
    t.is( d.minute, 1 );
  }
);
test(
  'parseDuration("2 minutes")',
  t => {
    const d = parseDuration('2 minutes');
    t.is( d.minute, 2 );
  }
);
test(
  'parseDuration("1 second")',
  t => {
    const d = parseDuration('1 second');
    t.is( d.second, 1 );
  }
);
test(
  'parseDuration("2 seconds")',
  t => {
    const d = parseDuration('2 seconds');
    t.is( d.second, 2 );
  }
);
test(
  'parseDuration("1 year 2 months 3 days 4 hours 5 minutes 6 seconds")',
  t => {
    const d = parseDuration('1 year 2 months 3 days 4 hours 5 minutes 6 seconds');
    t.is( d.year, 1 );
    t.is( d.month, 2 );
    t.is( d.day, 3 );
    t.is( d.hour, 4 );
    t.is( d.minute, 5 );
    t.is( d.second, 6 );
  }
);
test(
  'parseDuration("1 year, 2 months, 3 days, 4 hours, 5 minutes and 6 seconds")',
  t => {
    const d = parseDuration('1 year, 2 months, 3 days, 4 hours, 5 minutes and 6 seconds');
    t.is( d.year, 1 );
    t.is( d.month, 2 );
    t.is( d.day, 3 );
    t.is( d.hour, 4 );
    t.is( d.minute, 5 );
    t.is( d.second, 6 );
  }
);

test(
  'singularDurations()',
  t => {
    const s = singularDurations({ years: 1, months: 2, days: 3, hours: 4, minutes: 5, seconds: 6 });
    t.is( s.year, 1 );
    t.is( s.month, 2 );
    t.is( s.day, 3 );
    t.is( s.hour, 4 );
    t.is( s.minute, 5 );
    t.is( s.second, 6 );
  }
);