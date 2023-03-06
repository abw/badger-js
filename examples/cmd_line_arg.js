#!/usr/bin/env node
import { cmdLineArg, quit } from '../src/Badger.js';

const name = await cmdLineArg('What is your name?')
  || quit('No name provided')

console.log(`Hello ${name}`);
