import test from 'ava';
import { config } from '../../../src/Badger.js'
import { bin } from '@abw/badger-filesystem'

// current directory where this script is located
const thisDir = bin(import.meta.url);
const cfg = config(thisDir.dir('../config_dir'))

test.serial(
  'read the animal config',
  t => cfg.config('animal').then(
    data => t.is( data.name, 'Badger' )
  )
);
