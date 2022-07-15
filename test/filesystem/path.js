import test from 'ava';
import { file } from '../../src/Badger.js'

const p1 = file('/foo/bar');
test(
  'file() creates a path object',
  t => t.is(p1.path(), '/foo/bar')
);
test(
  'relative path down',
  t => t.is(p1.relativePath('baz'), '/foo/bar/baz')
);
test(
  'relative path up',
  t => t.is(p1.relativePath('..'), '/foo')
);
test(
  'relative path up and down',
  t => t.is(p1.relativePath('../wiz/bang'), '/foo/wiz/bang')
);
