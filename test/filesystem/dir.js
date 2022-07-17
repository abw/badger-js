import test from 'ava';
import { dir, bin } from '../../src/Badger.js'

// current directory where this script is located
const thisDir = bin(import.meta.url);
const testFiles = thisDir.dir('test_files');
const testDir = testFiles.dir('test_dir');
const subDir = testDir.dir('sub_directory');
const tmpDir = testFiles.dir('tmp');
const cloneDir = dir(testFiles);


test.serial(
  'the test_files directory exists',
  async t => t.is( await testFiles.exists(), true)
);

test.serial(
  'the no_such_dir directory does not exist',
  async t => t.is( await thisDir.dir('no_such_dir').exists(), false )
);


test.serial(
  'we can create a directory from an existing directory object',
  t => t.is( cloneDir.path(), testFiles.path() )
);

test.serial(
  'destroy the test_dir directory if it exists',
  async t => {
    if (await testDir.exists()) {
      await testDir.destroy();
      t.is(await testDir.exists(), false)
    }
    else {
      t.pass();
    }
  }
);

test.serial(
  'create the test_dir directory',
  async t => {
    await testDir.mkdir();
    t.is( await testDir.exists(), true)
  }
);


test.serial(
  'the test_dir directory must exist',
  async t => t.is( await testDir.mustExist(), testDir)
);
test.serial(
  'the test_dir directory must exist again',
  async t => t.is( await testDir.mustExist(), testDir)
);

test.serial(
  'delete the test_dir directory',
  async t => {
    await testDir.rmdir();
    t.is(await testDir.exists(), false)
  }
);

test.serial(
  "mustExist throws error if directory doesn't exist",
  async t => {
    const error = await t.throwsAsync( () => testDir.mustExist() );
    t.is(error.message, "Directory does not exist: " + testDir.path())
  }
);

test.serial(
  'mustExist creates directory with mkdir option',
  async t => {
    const result = await testDir.mustExist({ mkdir: true });
    t.is( result, testDir );
    t.is( await testDir.exists(), true );
  }
);

test.serial(
  'delete the test_dir directory again',
  async t => {
    await testDir.rmdir();
    t.is(await testDir.exists(), false)
  }
);

test.serial(
  'mustExist creates sub-directory with mkdir and recurse option',
  async t => {
    const result = await subDir.mustExist({ mkdir: true, recursive: true });
    t.is( result, subDir );
    t.is( await subDir.exists(), true );
  }
);

test.serial(
  'mustExist returns object when directory exists',
  async t => {
    const result = await subDir.mustExist();
    t.is( result, subDir );
    t.is( await subDir.exists(), true );
  }
);

test.serial(
  'delete the test_dir and sub_directory directories once more',
  async t => {
    await testDir.destroy();
    t.is(await subDir.exists(), false);
    t.is(await testDir.exists(), false);
  }
);

test.serial(
  'mustExist creates sub-directory with create option',
  async t => {
    await subDir.mustExist({ create: true });
    t.is( await subDir.exists(), true );
  }
);

test.serial(
  'destroy the test_dir directory',
  async t => {
    await testDir.destroy();
    t.is( await testDir.exists(), false );
  }
)

test.serial(
  'destroy the tmp directory',
  async t => {
    await tmpDir.destroy();
    t.is( await tmpDir.exists(), false );
  }
)

test.serial(
  'read the test_files directory',
  async t => {
    const files = await testFiles.read();
    t.is( files[0], 'hello.json' );
    t.is( files[1], 'hello.txt' )
    t.is( files[2], 'hello.yaml' )
  }
);
