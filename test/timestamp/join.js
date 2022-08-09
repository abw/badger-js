import test from 'ava';
import { joinDate, joinTime, joinTimestamp } from '../../src/Badger/Timestamp.js'

//-----------------------------------------------------------------------------
// date
//-----------------------------------------------------------------------------
test(
  'join a date with default joint',
  t => {
    const date = joinDate({ year: 2022, month: 8, day: 9 });
    t.is( date, '2022-08-09' );
  }
);
test(
  'join a date with custom joint',
  t => {
    const date = joinDate({ year: 2022, month: 8, day: 9 }, '/');
    t.is( date, '2022/08/09' );
  }
);

//-----------------------------------------------------------------------------
// time
//-----------------------------------------------------------------------------
test(
  'join a time with default joint',
  t => {
    const time = joinTime({ hours: 1, minutes: 2, seconds: 3 });
    t.is( time, '01:02:03' );
  }
);
test(
  'join a time with custom joint',
  t => {
    const time = joinTime({ hours: 1, minutes: 2, seconds: 3 }, ' ');
    t.is( time, '01 02 03' );
  }
);

//-----------------------------------------------------------------------------
// timestamp
//-----------------------------------------------------------------------------
test(
  'join a timestamp with default joints',
  t => {
    const stamp = joinTimestamp({ year: 2022, month: 8, day: 9, hours: 1, minutes: 2, seconds: 3 });
    t.is( stamp, '2022-08-09 01:02:03' );
  }
);
test(
  'join a timestamp with custom date joint',
  t => {
    const stamp = joinTimestamp({ year: 2022, month: 8, day: 9, hours: 1, minutes: 2, seconds: 3 }, { dateJoint: '/' });
    t.is( stamp, '2022/08/09 01:02:03' );
  }
);
test(
  'join a timestamp with custom time joint',
  t => {
    const stamp = joinTimestamp({ year: 2022, month: 8, day: 9, hours: 1, minutes: 2, seconds: 3 }, { timeJoint: '.' });
    t.is( stamp, '2022-08-09 01.02.03' );
  }
);
test(
  'join a timestamp with custom joint',
  t => {
    const stamp = joinTimestamp({ year: 2022, month: 8, day: 9, hours: 1, minutes: 2, seconds: 3 }, { joint: 'T' });
    t.is( stamp, '2022-08-09T01:02:03' );
  }
);
