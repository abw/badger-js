import test from 'ava';
import { bin } from '../../src/Badger.js'

// current directory where this script is located
const thisDir = bin(import.meta.url);
const testFiles = thisDir.dir('test_files');
// const testDir = testFiles.dir('test_dir', { debug: true, debugPrefix: 'test_dir > ', debugColor: 'red'});
const testDir = testFiles.dir('test_dir');
const subDir = testDir.dir('sub_directory');

test.serial(
  'the test_files directory exists',
  async t => t.is( await testFiles.exists(), true)
);
test.serial(
  'make the test_dir directory using mkdir()',
  async t => {
    const exists = await testDir.exists();
    if (exists) {
      t.pass();
    }
    else {
      await testDir.mkdir();
      t.is( await testDir.exists(), true)
    }
  }
);
test.serial(
  'make the sub_directory directory using mkdir()',
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
  'delete the test directory recursively using rmdir() with options',
  async t => {
    await testDir.rmdir({ empty: true, recursive: true, force: true });
    t.is(await testDir.exists(), false)
  }
);

test.serial(
  'make the sub_directory directory recursively with mkdir() and recursive option',
  async t => {
    await subDir.mkdir({ recursive: true });
    t.is( await testDir.exists(), true)
    t.is( await subDir.exists(), true)
  }
);

test.serial(
  'sub_directory should be empty',
  async t => {
    const empty = await subDir.isEmpty();
    t.is( empty, true)
  }
);

test.serial(
  'delete the test directory once more using rmdir() and all options',
  async t => {
    await testDir.rmdir({ empty: true, recursive: true, force: true });
    t.is(await testDir.exists(), false)
  }
);


test.serial(
  'create the sub_directory recursively using create()',
  async t => {
    await subDir.create();
    t.is( await testDir.exists(), true)
    t.is( await subDir.exists(), true)
  }
);
