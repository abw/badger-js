import test from 'ava';
import { timestamp } from '../../src/Badger/Timestamp.js'

test(
  'default dateJoint option',
  t => {
    const stamp = timestamp('2022/08/09 01:02:03');
    t.is( stamp.date(), '2022-08-09' );
  }
);

test(
  'custom dateJoint option',
  t => {
    const stamp = timestamp('2022-08-09 01:02:03', { dateJoint: '/' });
    t.is( stamp.date(), '2022/08/09' );
  }
);

test(
  'default timeJoint option',
  t => {
    const stamp = timestamp('2022/08/09 01:02:03');
    t.is( stamp.time(), '01:02:03' );
  }
);

test(
  'custom timeJoint option',
  t => {
    const stamp = timestamp('2022-08-09 01:02:03', { timeJoint: ' : ' });
    t.is( stamp.time(), '01 : 02 : 03' );
  }
);

test(
  'custom joint option',
  t => {
    const stamp = timestamp('2022/08/09 01:02:03', { joint: 'T' });
    t.is( stamp.stamp(), '2022-08-09T01:02:03' );
  }
);

test(
  'custom date joint argument',
  t => {
    const stamp = timestamp('2022-08-09 01:02:03');
    t.is( stamp.date('/'), '2022/08/09' );
  }
);

test(
  'custom time joint argument',
  t => {
    const stamp = timestamp('2022-08-09 01:02:03');
    t.is( stamp.time(' '), '01 02 03' );
  }
);

test(
  'custom stamp joint argument',
  t => {
    const stamp = timestamp('2022/08/09 01:02:03');
    t.is( stamp.stamp({ joint: 'T' }), '2022-08-09T01:02:03' );
  }
);

test(
  'custom joint arguments',
  t => {
    const stamp = timestamp('2022/08/09 01:02:03');
    t.is( stamp.stamp({ dateJoint: '/', timeJoint: ' ', joint: 'T' }), '2022/08/09T01 02 03' );
  }
);
