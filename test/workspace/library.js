import test from 'ava';
import { workspace } from '../../src/Badger.js'
import { bin } from '@abw/badger-filesystem'

const DEBUG = false;
const testDir = bin(import.meta.url).dir('test_space');
const testSpace = workspace(
  testDir,
  {
    debug: DEBUG,
    debugPrefix: '    workspace > ',
    debugColor: 'blue',
    config: {
      debug: DEBUG,
      debugPrefix: '    config > ',
      debugColor: 'green'
    }
  }
);

test.serial(
  'the workspace directory is set',
  t => t.is( testSpace.dir().path(), testDir.path() )
);
test.serial(
  'load a library',
  async t => {
    const lib = await testSpace.library('Module1');
    t.is( lib.a, 10 );
    t.is( lib.b, 20 );
  }
);
test.serial(
  'destructure a loaded library',
  async t => {
    const { default: stuff, a, b, } = await testSpace.library('Module1');
    t.is( stuff.a, 10 );
    t.is( a, 10 );
    t.is( b, 20 );
  }
);
