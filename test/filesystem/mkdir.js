import test from 'ava';
import { bin } from '../../src/Badger.js'

// current directory where this script is located
const thisDir = bin(import.meta.url);
const testFiles = thisDir.dir('test_files');
const testDir = testFiles.dir('test_dir');
const subDir = testDir.dir('sub_directory');

test.serial(
  'the test_files directory exists',
  t => t.is( testFiles.exists(), true)
);
test.serial(
  'make the test_dir directory using mkdir()',
  t => {
    if (testDir.exists()) {
      t.pass();
    }
    else {
      testDir.mkdir();
      t.is( testDir.exists(), true)
    }
  }
);
test.serial(
  'make the sub_directory directory using mkdir()',
  t => {
    if (subDir.exists()) {
      t.pass();
    }
    else {
      subDir.mkdir();
      t.is( subDir.exists(), true)
    }
  }
);

test.serial(
  'delete the test directory recursively using rmdir() with options',
  t => {
    testDir.rmdir({ empty: true, recursive: true, force: true });
    t.is(testDir.exists(), false)
  }
);

test.serial(
  'make the sub_directory directory recursively with mkdir() and recursive option',
  t => {
    subDir.mkdir({ recursive: true });
    t.is( testDir.exists(), true)
    t.is( subDir.exists(), true)
  }
);

test.serial(
  'delete the test directory once more using rmdir() and all options',
  t => {
    testDir.rmdir({ empty: true, recursive: true, force: true });
    t.is(testDir.exists(), false)
  }
);

test.serial(
  'create the sub_directory recursively using create()',
  t => {
    subDir.create();
    t.is( testDir.exists(), true)
    t.is( subDir.exists(), true)
  }
);
