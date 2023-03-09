#!/usr/bin/env node
import { bin } from '@abw/badger-filesystem';
import { setup } from '../../../src/Badger/Utils/Setup.js'

await setup({
  rootDir: bin().up(),
  writeEnv: true,
  // Defaults:
  // configFile:   'config/setup.yaml',
  // dataFile:     '.env.yaml',
  // writeData:    true,
  // envFile:      '.env',
  // writeEnv:     false,
  // allDone:      'All configuration options have been set'
});
