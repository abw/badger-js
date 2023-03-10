#!/usr/bin/env node
import { cmdLineFlags } from '../src/Badger.js';

const { flags, args } = cmdLineFlags();
console.log('flags:', flags);
console.log('args:', args);
