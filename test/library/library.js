import test from 'ava';
import { bin, library } from '../../src/Badger.js'

const DEBUG = false;
const testDir = bin(import.meta.url).dir('test_libs');
const testLib = library({
  root: testDir,
  dir: 'libA libB libC',
  debug: DEBUG,
  debugPrefix: '    library > ',
  debugColor: 'red',
});

test(
  'the library has 2 library directories',
  async t => {
    const dirs = await testLib.dirs();
    t.is( dirs.length, 2 )
  }
);
test(
  'the library can load one(.js)',
  async t => {
    const one = await testLib.lib('one');
    t.is( one.one, 1 )
  }
);
test(
  'the library can load two(.mjs)',
  async t => {
    const two = await testLib.lib('two');
    t.is( two.two, 2 )
  }
);
test(
  'the library can load three(.js)',
  async t => {
    const three = await testLib.lib('three');
    t.is( three.three, 3 )
  }
);
test(
  'the library cannnot load four',
  async t => {
    const error = await t.throwsAsync( () => testLib.lib('four') );
    t.is( error.message, "Library not found: four" )
  }
);
