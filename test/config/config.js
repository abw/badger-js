import test from 'ava';
import { bin, config } from '../../src/Badger.js'

// current directory where this script is located
const thisDir = bin(import.meta.url);
const cfgDir = thisDir.dir('config_dir');
const cfg = config({ dir: cfgDir })

test.serial(
  'the config directory is set',
  t => t.is( cfg.dir.path(), cfgDir.path() )
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
  'read the wibble config',
  async t => {
    const data = await cfg.config('wibble');
    console.log('wibble data: ', data);

    t.is( data.name, 'Conga' )
  }
);

