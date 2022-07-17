import test from 'ava';
import { file, bin } from '../../src/Badger.js'

// current directory where this script is located
const thisDir = bin(import.meta.url);
const testFiles = thisDir.dir('test_files');
const tmpFiles = testFiles.dir('tmp');

test(
  'the test_files directory exists',
  async t => t.is( await testFiles.exists(), true)
);
test(
  'create the tmp sub-directory',
  async t => t.is( await tmpFiles.mustExist({ create: true }), tmpFiles )
);

// simple text file accessed using file() method of directory
const hello = testFiles.file('hello.txt');
test(
  'accessed the hello.txt file via the directory.file() method',
  async t => t.is( await hello.exists(), true )
);

// same file accessed using standalone file() function
const hello2 = file(hello.path());
test(
  'accessed the hello.txt file using the file() function',
  async t => t.is( await hello2.exists(), true )
);

// file directory() method
test(
  'the hello.txt directory should be the test_files directory',
  t => t.is( hello2.directory().path(), testFiles.path() )
)

// file encoding option
test(
  'default file encoding should be utf8',
  t => t.is( hello2.options().encoding, 'utf8' )
)
test(
  'can override the file encoding',
  t => t.is( hello2.options({ encoding: 'utf11' }).encoding, 'utf11' ) // one louder
)
test(
  'encoding can be set when file is created',
  t => t.is( file(hello.path(), { encoding: 'utf11' }).options().encoding, 'utf11' )
)

// file read()
test(
  'can read text from file',
  t => hello.read().then(
    text => t.is(text, "Hello World!\n")
  )
)
test(
  'can read text from file with explicit encoding',
  t => hello.read({ encoding: 'utf8' }).then(
    text => t.is(text, "Hello World!\n")
  )
)
test(
  'await read text from file',
  async t => t.is(await hello.read(), "Hello World!\n")
)

// read YAML
test(
  'read data from YAML file with pre-defined codec',
  t => testFiles.file('hello.yaml', { codec: 'yaml' }).read().then(
    data => t.is(data.msg, "Hello World")
  )
)
test(
  'read data from YAML file with codec defined in read() options',
  t => testFiles.file('hello.yaml').read({ codec: 'yaml' }).then(
    data => t.is(data.msg, "Hello World")
  )
)
test(
  'await read data from YAML file with codec defined in read() options',
  async t => t.is((await testFiles.file('hello.yaml').read({ codec: 'yaml' })).msg, "Hello World")
)

// read JSON
test(
  'read data from JSON file with pre-defined codec',
  t => testFiles.file('hello.json', { codec: 'json' }).read().then(
    data => t.is(data.msg, "Hello World")
  )
)
test(
  'read data from JSON file with codec defined in read() options',
  t => testFiles.file('hello.json').read({ codec: 'json' }).then(
    data => t.is(data.msg, "Hello World")
  )
)
test(
  'await read data from JSON file with codec defined in read() options',
  async t => t.is((await testFiles.file('hello.json').read({ codec: 'json' })).msg, "Hello World")
)

