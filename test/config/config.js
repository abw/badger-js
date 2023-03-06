import test from 'ava';
import { config } from '../../src/Badger.js'
import { bin } from '@abw/badger-filesystem'

// current directory where this script is located
const thisDir = bin(import.meta.url);
const cfgDir = thisDir.dir('config_dir');
const cfg = config(cfgDir)

test.serial(
  'the config directory is set',
  t => t.is( cfg.state.dirs[0].path(), cfgDir.path() )
);

test.serial(
  'read the animal config',
  t => cfg.config('animal').then(
    data => t.is( data.name, 'Badger' )
  )
);

test.serial(
  'read the dance config',
  t => cfg.config('dance').then(
    data => t.is( data.name, 'Conga' )
  )
);

test.serial(
  'read the dance config async',
  async t => {
    const data = await cfg.config('dance');
    t.is( data.name, 'Conga' )
  }
);

test.serial(
  'read the wibble config with defaults',
  async t => {
    const data = await cfg.config('wibble', { name: 'wobble' });
    t.is( data.name, 'wobble' )
  }
);

test.serial(
  'read the wibble config',
  async t => {
    const error = await t.throwsAsync( () => cfg.config('wibble') );
    t.is(error.message, "No configuration file for wibble")
  }
);

test.serial(
  'read the pouch.js config',
  async t => {
    const data = await cfg.config('pouch');
    t.is( data.pouch, 'frusset' )
    t.is( data.message, 'You have most pleasantly wibbled my frusset pouch' )
    t.is( data.default.attrib, 'Queen Asphyxia XIX' )
  }
);

//-----------------------------------------------------------------------------
// #fragment dataPath
//-----------------------------------------------------------------------------
test.serial(
  'read the animal config with #name fragment',
  t => cfg.config('animal#name').then(
    data => t.is( data, 'Badger' )
  )
);
test.serial(
  'read the wibble config with defaults and #name fragment',
  async t => {
    const data = await cfg.config('wibble#name', { name: 'wobble' });
    t.is( data, 'wobble' )
  }
);
test.serial(
  'read the pouch.js config with path #message',
  async t => {
    const message = await cfg.config('pouch#message');
    t.is( message, 'You have most pleasantly wibbled my frusset pouch' )
  }
);