import test from 'ava';
import { bin, workspace } from '../../src/Badger.js'

const DEBUG = false;
const thisDir = bin(import.meta.url);
const testDir = thisDir.dir('test_space');
const testSpace = workspace({
  dir: testDir,
  debug: DEBUG,
  debugPrefix: 'workspace > ',
  debugColor: 'blue',
  config: {
    debug: DEBUG,
    debugPrefix: 'config > ',
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