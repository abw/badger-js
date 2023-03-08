#!/usr/bin/env node
import { prompt, confirm, select } from '../src/Badger/Utils/Prompt.js'

// demonstration / test of prompt() and confirm()

const main = async () => {
  const name = await prompt("What is your name?", 'Mr Badger');
  console.log('Hello ', name);

  const yes = await confirm("Are you sure?", true);
  console.log('You said "%s"', yes ? 'YES' : 'NO');

  const animal = await select(
    'What is your favourite animal?',
    {
      aardvark: 'Aaardvark',
      badger: 'Badger',
      cat: 'Cat',
      dog: 'Dog'
    },
    1
  );
  console.log('You chose:', animal);

}

main();

