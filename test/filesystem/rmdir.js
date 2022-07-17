import test from 'ava';
import { bin } from '../../src/Badger.js'

// current directory where this script is located
const thisDir = bin(import.meta.url);
const testFiles = thisDir.dir('test_files');
const testDir = testFiles.dir('test_dir');
const subDir = testDir.dir('sub_directory');

test.serial(
  'the test_files directory exists',
  async t => t.is( await testFiles.exists(), true)
);

test.serial(
  'create the test_dir directory using mkdir()',
  async t => {
    if (await testDir.exists()) {
      t.pass();
    }
    else {
      await testDir.mkdir();
      t.is( await testDir.exists(), true)
    }
  }
);

test.serial(
  'create the sub_directory directory using mkdir()',
  async t => {
    if (await subDir.exists()) {
      t.pass();
    }
    else {
      await subDir.mkdir();
      t.is( await subDir.exists(), true)
    }
  }
);

test.serial(
  'delete the sub_directory directory using rmdir()',
  async t => {
    await subDir.rmdir();
    t.is(await subDir.exists(), false)
  }
);

test.serial(
  'delete the test_dir directory using rmdir()',
  async t => {
    await testDir.rmdir();
    t.is(await testDir.exists(), false)
  }
);

test.serial(
  'create the sub_directory directory recursively using mkdir() with recursive option',
  async t => {
    await subDir.mkdir({ recursive: true });
    t.is( await subDir.exists(), true)
  }
);

test.serial(
  'delete the test_dir directory recursively using rmdir() and all options',
  async t => {
    await testDir.rmdir({ empty: true, force: true, recursive: true });
    t.is( await subDir.exists(), false)
    t.is( await testDir.exists(), false)
  }
);

test.serial(
  'create the sub_directory directory once more',
  async t => {
    await subDir.mkdir({ recursive: true });
    t.is( await subDir.exists(), true)
  }
);

test.serial(
  'delete the test_dir directory recursively using destroy()',
  async t => {
    await testDir.destroy();
    t.is( await subDir.exists(), false)
    t.is( await testDir.exists(), false)
  }
);
