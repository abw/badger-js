#!/usr/bin/env node
import { cmdLineFlags, quit } from '../src/Badger.js';

const help = `
example.js (options) [words...]

Options:
  -h / --help     This help
  -v / --version  Print version number
  -d / --debug    Debugging
  -n number       A number
  --hello         Say "Hello World!"
`

let n;
const { flags, args } = cmdLineFlags(
  {
    short: {
      d: 'debug',
      h: 'help',
      v: 'version'
    },
    options: 'debug hello n',
    on: {
      help:    () => quit(help),
      version: () => quit("Version 1.2.3"),
      hello:   () => console.log('Hello World!'),
      n:       (name, arg, args, flags) => {
        n = args.shift();
        flags.number = n;
        return true;
      }
    }
  }
);
if (flags.debug) {
  console.log('flags:', flags);
  console.log('args:', args);
}
if (flags.number) {
  console.log(`The number was set to ${n}`);
}
console.log('Words:', args);


