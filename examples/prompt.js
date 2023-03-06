#!/usr/bin/env node
import { prompt, confirm } from '../src/Badger/Utils/Prompt.js'

// demonstration / test of prompt() and confirm()

const main = async () => {
  const name = await prompt("What is your name?", { default: 'Mr Badger' });
  console.log('Hello ', name);
  const name2 = await prompt("What is your name?", 'Mr Badger');
  console.log('Hello ', name2);
  const yes = await confirm("Are you sure?", { default: true });
  console.log('You said "%s"', yes ? 'YES' : 'NO');
}

main();

