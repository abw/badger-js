#!/usr/bin/env node
import { Debugger } from '@abw/badger'

const debugOn  = Debugger(true);
const debugOff = Debugger(false);

debugOn('This message will be displayed: %s', 'Hello World!');
debugOff('This message will be NOT be displayed: %s', 'Hello World!');

const debugPrefix = Debugger(true, 'DEBUG > ');

debugPrefix('This message will have a prefix');

const debugColor = Debugger(true, 'DEBUG > ', 'bright cyan');

debugColor('This message will have a bright cyan prefix');

