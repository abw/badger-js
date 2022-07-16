import test from 'ava';
import { bin } from '../../src/Badger.js'

// current directory where this script is located
const thisDir = bin(import.meta.url);
const testFiles = thisDir.dir('test_files');
const tmpFiles = testFiles.dir('tmp');

test.serial(
  'the test_files directory exists',
  t => t.is( testFiles.exists(), true)
);
test.serial(
  'create the tmp sub-directory',
  t => t.is( tmpFiles.mustExist({ create: true }), tmpFiles )
);

// read/write YAML and JSON
const rnum   = Math.floor(Math.random() * 1000);
const string = "I Wrote This!"

test.serial(
  'write and read YAML data with pre-defined codec',
  t => tmpFiles.file('readwrite.yaml', { codec: 'yaml' }).write({ msg: string, random: rnum })
    .then( file => file.read() )
    .then( data => t.is(data.msg, string) && t.is(data.random, rnum) )
)
test.serial(
  'write and read JSON data',
  t => tmpFiles.file('readwrite.json', { codec: 'json' }).write({ msg: string, random: rnum })
    .then( file => file.read() )
    .then( data => t.is(data.msg, string) && t.is(data.random, rnum) )
)
test.serial(
  'write and read YAML data with late options',
  t => tmpFiles.file('readwrite.yaml').write({ msg: string, random: rnum }, { codec: 'yaml' })
    .then( file => file.read({ codec: 'yaml' }) )
    .then( data => t.is(data.msg, string) && t.is(data.random, rnum) )
)
test.serial(
  'write and read JSON data with late options',
  t => tmpFiles.file('readwrite.json').write({ msg: string, random: rnum }, { codec: 'json' })
    .then( file => file.read({ codec: 'json' }) )
    .then( data => t.is(data.msg, string) && t.is(data.random, rnum) )
)
