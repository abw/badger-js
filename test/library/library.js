import test from 'ava';
import { bin, library, splitList } from '../../src/Badger.js'

const DEBUG = false;
const testDir = bin(import.meta.url).dir('test_libs');
const testLib = library(
  splitList('libA libB libC').map( dir => testDir.dir(dir) ),
  {
    debug: DEBUG,
    debugPrefix: '    library > ',
    debugColor: 'red',
  }
);
const testLib2 = library(
  testDir.dir('libA'),
  {
    debug: DEBUG,
    debugPrefix: '    library > ',
    debugColor: 'red',
  }
);

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
    const one = await testLib.library('one');
    t.is( one.one, 1 )
  }
);
test(
  'the library can load two(.mjs)',
  async t => {
    const two = await testLib.library('two');
    t.is( two.two, 2 )
  }
);
test(
  'the library can load three(.js)',
  async t => {
    const three = await testLib.library('three');
    t.is( three.three, 3 )
  }
);
test(
  'the library cannnot load four',
  async t => {
    const error = await t.throwsAsync( () => testLib.library('four') );
    t.is( error.message, "Library not found: four" )
  }
);
test(
  'the library can load five/six',
  async t => {
    const fiveSix = await testLib.library('five/six');
    t.is( fiveSix.five, 5 )
    t.is( fiveSix.six, 6 )
  }
);

test(
  'the library can load five/six and resolve #five fragment',
  async t => {
    const five = await testLib.library('five/six#five');
    t.is( five, 5 )
  }
);
test(
  'the library can load five/six and resolve #seven fragment',
  async t => {
    const seven = await testLib.library('five/six#seven');
    t.is( seven, 7 )
  }
);
test(
  'the library can load five/six and resolve #eleven fragment',
  async t => {
    const eleven = await testLib.library('five/six#eleven');
    t.is( eleven, 'one louder' )
  }
);

//-----------------------------------------------------------------------------
// library2 - has a single directory
//-----------------------------------------------------------------------------
test(
  'the second library has 1 library directories',
  async t => {
    const dirs = await testLib2.dirs();
    t.is( dirs.length, 1 )
  }
);
test(
  'the second library can load one(.js)',
  async t => {
    const one = await testLib2.library('one');
    t.is( one.one, 1 )
  }
);
