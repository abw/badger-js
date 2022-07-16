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
  'create the test_dir directory using mkdir()',
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
  'create the sub_directory directory using mkdir()',
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
  'delete the sub_directory directory using rmdir()',
  t => {
    subDir.rmdir();
    t.is(subDir.exists(), false)
  }
);

test.serial(
  'delete the test_dir directory using rmdir()',
  t => {
    testDir.rmdir();
    t.is(testDir.exists(), false)
  }
);

test.serial(
  'create the sub_directory directory recursively using mkdir() with recursive option',
  t => {
    subDir.mkdir({ recursive: true });
    t.is( subDir.exists(), true)
  }
);

test.serial(
  'delete the test_dir directory recursively using rmdir() and all options',
  t => {
    testDir.rmdir({ empty: true, force: true, recursive: true });
    t.is( subDir.exists(), false)
    t.is( testDir.exists(), false)
  }
);

test.serial(
  'create the sub_directory directory once more',
  t => {
    subDir.mkdir({ recursive: true });
    t.is( subDir.exists(), true)
  }
);

test.serial(
  'delete the test_dir directory recursively using destroy()',
  t => {
    testDir.destroy();
    t.is( subDir.exists(), false)
    t.is( testDir.exists(), false)
  }
);
