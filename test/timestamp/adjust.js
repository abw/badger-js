import test from 'ava';
import { timestamp } from '../../src/Badger/Timestamp.js'

//-----------------------------------------------------------------------------
// year(s)
//-----------------------------------------------------------------------------
test(
  "adjust('1 year')",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust('1 year');
    t.is( s.stamp(), '2023-09-08 07:06:05' )
  }
);
test(
  "adjust('1 years')",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust('1 years');
    t.is( s.stamp(), '2023-09-08 07:06:05' )
  }
);
test(
  "adjust('-1 years')",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust('-1 years');
    t.is( s.stamp(), '2021-09-08 07:06:05' )
  }
);
test(
  "adjust({ year: 1 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ year: 1 });
    t.is( s.stamp(), '2023-09-08 07:06:05' )
  }
);
test(
  "adjust({ year: -1 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ year: -1 });
    t.is( s.stamp(), '2021-09-08 07:06:05' )
  }
);
test(
  "adjust({ years: 1 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ years: 1 });
    t.is( s.stamp(), '2023-09-08 07:06:05' )
  }
);

//-----------------------------------------------------------------------------
// month(s)
//-----------------------------------------------------------------------------
test(
  "adjust('1 month')",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust('1 month');
    t.is( s.stamp(), '2022-10-08 07:06:05' )
  }
);
test(
  "adjust('1 months')",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust('1 months');
    t.is( s.stamp(), '2022-10-08 07:06:05' )
  }
);
test(
  "adjust('-1 months')",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust('-1 months');
    t.is( s.stamp(), '2022-08-08 07:06:05' )
  }
);
test(
  "adjust({ month: 1 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ month: 1 });
    t.is( s.stamp(), '2022-10-08 07:06:05' )
  }
);
test(
  "adjust({ months: 1 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ months: 1 });
    t.is( s.stamp(), '2022-10-08 07:06:05' )
  }
);

//-----------------------------------------------------------------------------
// day(s)
//-----------------------------------------------------------------------------
test(
  "adjust('1 day')",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust('1 day');
    t.is( s.stamp(), '2022-09-09 07:06:05' )
  }
);
test(
  "adjust('1 days')",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust('1 days');
    t.is( s.stamp(), '2022-09-09 07:06:05' )
  }
);
test(
  "adjust('-1 days')",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust('-1 days');
    t.is( s.stamp(), '2022-09-07 07:06:05' )
  }
);
test(
  "adjust({ day: 1 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ day: 1 });
    t.is( s.stamp(), '2022-09-09 07:06:05' )
  }
);
test(
  "adjust({ days: 1 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ days: 1 });
    t.is( s.stamp(), '2022-09-09 07:06:05' )
  }
);

//-----------------------------------------------------------------------------
// hour(s)
//-----------------------------------------------------------------------------
test(
  "adjust('1 hour')",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust('1 hour');
    t.is( s.stamp(), '2022-09-08 08:06:05' )
  }
);
test(
  "adjust('1 hours')",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust('1 hours');
    t.is( s.stamp(), '2022-09-08 08:06:05' )
  }
);
test(
  "adjust({ hour: 1 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ hour: 1 });
    t.is( s.stamp(), '2022-09-08 08:06:05' )
  }
);
test(
  "adjust({ hours: 1 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ hours: 1 });
    t.is( s.stamp(), '2022-09-08 08:06:05' )
  }
);

//-----------------------------------------------------------------------------
// minute(s)
//-----------------------------------------------------------------------------
test(
  "adjust('1 minute')",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust('1 minute');
    t.is( s.stamp(), '2022-09-08 07:07:05' )
  }
);
test(
  "adjust('1 minutes')",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust('1 minutes');
    t.is( s.stamp(), '2022-09-08 07:07:05' )
  }
);
test(
  "adjust({ minute: 1 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ minute: 1 });
    t.is( s.stamp(), '2022-09-08 07:07:05' )
  }
);
test(
  "adjust({ minutes: 1 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ minutes: 1 });
    t.is( s.stamp(), '2022-09-08 07:07:05' )
  }
);

//-----------------------------------------------------------------------------
// second(s)
//-----------------------------------------------------------------------------
test(
  "adjust('1 second')",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust('1 second');
    t.is( s.stamp(), '2022-09-08 07:06:06' )
  }
);
test(
  "adjust('1 seconds')",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust('1 seconds');
    t.is( s.stamp(), '2022-09-08 07:06:06' )
  }
);
test(
  "adjust({ second: 1 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ second: 1 });
    t.is( s.stamp(), '2022-09-08 07:06:06' )
  }
);
test(
  "adjust({ seconds: 1 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ seconds: 1 });
    t.is( s.stamp(), '2022-09-08 07:06:06' )
  }
);

//-----------------------------------------------------------------------------
// overflow
//-----------------------------------------------------------------------------
test(
  "adjust({ seconds: 200 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ seconds: 200 });
    t.is( s.stamp(), '2022-09-08 07:09:25' )
  }
);
test(
  "adjust({ minutes: 200 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ minutes: 200 });
    t.is( s.stamp(), '2022-09-08 10:26:05' )
  }
);
test(
  "adjust({ hours: 75 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ hours: 75 });
    t.is( s.stamp(), '2022-09-11 10:06:05' )
  }
);
test(
  "adjust({ days: 61 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ days: 61 });
    t.is( s.stamp(), '2022-11-08 07:06:05' )
  }
);
test(
  "adjust({ months: 20 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ months: 20 });
    t.is( s.stamp(), '2024-05-08 07:06:05' )
  }
);
test(
  "adjust({ years: 2 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ years: 2 });
    t.is( s.stamp(), '2024-09-08 07:06:05' )
  }
);

//-----------------------------------------------------------------------------
// underflow
//-----------------------------------------------------------------------------
test(
  "adjust({ seconds: -200 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ seconds: -200 });
    t.is( s.stamp(), '2022-09-08 07:02:45' )
  }
);
test(
  "adjust({ minutes: -200 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ minutes: -200 });
    t.is( s.stamp(), '2022-09-08 03:46:05' )
  }
);
test(
  "adjust({ hours: -75 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ hours: -80 });
    t.is( s.stamp(), '2022-09-04 23:06:05' )
  }
);
test(
  "adjust({ days: -400 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ days: -400 });
    t.is( s.stamp(), '2021-08-04 07:06:05' )
  }
);
test(
  "adjust({ months: -20 })",
  t => {
    const s = timestamp('2022-09-08 07:06:05').adjust({ months: -20 });
    t.is( s.stamp(), '2021-01-08 07:06:05' )
  }
);