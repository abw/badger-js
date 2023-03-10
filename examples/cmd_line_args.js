#!/usr/bin/env node
import { cmdLine, cmdLineArg, cmdLineArgs, quit } from '../src/Badger.js';

const args = cmdLine();

const [forename, surname] = await cmdLineArgs(
  ['What is your first name?', 'What is your surname'],
  args
) || quit('No name provided')

const age = await cmdLineArg(
  `Hello ${forename} ${surname}, how old are you?`,
  args
) || quit('No age provided')

console.log(`${age} is a fine age`);
