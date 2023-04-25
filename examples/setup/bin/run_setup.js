#!/usr/bin/env node
import { bin } from '@abw/badger-filesystem';
import { runSetup } from '../../../src/Badger/Utils/Setup.js'

const config = await runSetup({
  rootDir: bin().up(),
  writeEnv: true,
  // envExtra: '.env.extra',
  // Other options:
  //   configFile:   'config/setup.yaml',
  //   dataFile:     '.env.yaml',
  //   writeData:    true,
  //   envFile:      '.env',
  //   writeEnv:     false,
  //   envComments:  true,
  //   envSections:  true,
  //   compact:      false,
  //   allDone:      'All configuration options have been set'
});
console.log('config: ', config);
