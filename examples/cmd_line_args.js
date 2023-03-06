#!/usr/bin/env node
import { cmdLineArgs, quit } from '../src/Badger.js';

const [forename, surname] = await cmdLineArgs(
  ['What is your first name?', 'What is your surname']
) || quit('No name provided')

console.log(`Hello ${forename} ${surname}`);
