import test from 'ava';
import { dir, bin } from '../../src/Badger.js'

// current directory where this script is located
const thisDir = bin(import.meta.url);
const testFiles = thisDir.dir('test_files');
const testDir = testFiles.dir('test_dir');
const subDir = testDir.dir('sub_directory');
const tmpDir = testFiles.dir('tmp');

test.serial(
  'the test_files directory exists',
  t => t.is( testFiles.exists(), true)
);

test.serial(
  'destroy the test_dir directory if it exists',
  t => {
    if (testDir.exists()) {
      testDir.destroy();
      t.is(testDir.exists(), false)
    }
    else {
      t.pass();
    }
  }
);

test.serial(
  'create the test_dir directory',
  t => {
    testDir.mkdir();
    t.is( testDir.exists(), true)
  }
);

test.serial(
  'the test_dir directory must exist',
  t => t.is( testDir.mustExist(), testDir)
);

test.serial(
  'delete the test_dir directory',
  t => {
    testDir.rmdir();
    t.is(testDir.exists(), false)
  }
);

test.serial(
  "mustExist throws error if directory doesn't exist",
  t => {
    const error = t.throws( () => testDir.mustExist() );
    t.is(error.message, "Directory does not exist: " + testDir.path());
  }
);

test.serial(
  'mustExist creates directory with mkdir option',
  t => {
    t.is( testDir.mustExist({ mkdir: true }), testDir );
    t.is( testDir.exists(), true );
  }
);

test.serial(
  'delete the test_dir directory again',
  t => {
    testDir.rmdir();
    t.is(testDir.exists(), false)
  }
);

test.serial(
  'mustExist creates sub-directory with mkdir and recurse option',
  t => {
    t.is( subDir.mustExist({ mkdir: true, recursive: true }), subDir );
    t.is( subDir.exists(), true );
  }
);

test.serial(
  'delete the test_dir and sub_directory directories once more',
  t => {
    testDir.destroy();
    t.is(subDir.exists(), false);
    t.is(testDir.exists(), false);
  }
);

test.serial(
  'mustExist creates sub-directory with create option',
  t => {
    t.is( subDir.mustExist({ create: true }), subDir );
    t.is( subDir.exists(), true );
  }
);

test.serial(
  'destroy the test_dir directory',
    t => {
      testDir.destroy();
      t.is( testDir.exists(), false );
  }
)

test.serial(
  'destroy the tmp directory',
    t => {
      tmpDir.destroy();
      t.is( tmpDir.exists(), false );
  }
)

test.serial(
  'read the test_files directory',
  t => {
    const files = testFiles.read();
    t.is( files[0], 'hello.json' );
    t.is( files[1], 'hello.txt' )
    t.is( files[2], 'hello.yaml' )
  }
);
