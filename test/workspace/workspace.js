import test from 'ava';
import { bin, workspace } from '../../src/Badger.js'

const DEBUG = false;
const thisDir = bin(import.meta.url);
const testDir = thisDir.dir('test_space');
const testSpace = workspace({
  dir: testDir,
  debug: DEBUG,
  debugPrefix: '    workspace > ',
  debugColor: 'blue',
  config: {
    debug: DEBUG,
    debugPrefix: '    config > ',
    debugColor: 'green'
  }
});

test.serial(
  'the workspace directory is set',
  t => t.is( testSpace.dir().path(), testDir.path() )
);

test.serial(
  'fetch animal config',
  async t => {
    const config = await testSpace.config('animal');
    t.is( config.name, 'Bobby' );
    t.is( config.animal, 'Badger' );
  }
);
test.serial(
  'file read()',
  async t => {
    const text = await testSpace.file('foo/bar/baz.txt').read();
    t.is( text, 'Hello Baz!' );
  }
);

test.serial(
  'read()',
  async t => {
    const text = await testSpace.read('foo/bar/baz.txt');
    t.is( text, 'Hello Baz!' );
  }
);

test.serial(
  'write()',
  async t => {
    const file = await testSpace.file('foo/bar/boz.txt');
    await file.delete();
    await testSpace.write('foo/bar/boz.txt', 'Hello Boz!');
    const text = await testSpace.read('foo/bar/boz.txt');
    t.is( text, 'Hello Boz!' );
  }
);

