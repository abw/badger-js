#!/usr/bin/env node
import { options } from '../src/Badger/Utils/Options.js'

// example showing simple use of options()

const config = await options({
  name: 'options.js',
  version: '0.0.1',
  description: 'Example showing command line options and prompting',
  options: [
    {
      name:      'debug',
      short:     'D',
      about:     'Enable debugging'
    },
    {
      name:     'database',
      short:    'd',
      about:    'Database',
      type:     'text',
      prompt:   'What is the name of the database?',
      required: true,
    },
    {
      name:     'username',
      short:    'u',
      about:    'Username',
      type:     'text',
      prompt:   'What is the database username?',
    },
    {
      name:     'password',
      short:    'p',
      about:    'Password',
      type:     'password',
      prompt:   'What is the database password?',
    },
  ]
});
console.log('config: ', config);