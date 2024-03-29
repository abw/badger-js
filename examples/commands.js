#!/usr/bin/env node
import { options } from '../src/Badger/Utils/Options.js'

// example showing use of options()

const main = async () => {
  const config = await options({
    name: 'commands.js',
    description: 'Example showing command line commands.',
    version: '0.0.1',
    verbose: true,
    quiet: true,
    commands: [
      {
        name: 'start',
        pattern: '<service>',
        about: 'Start a service'
      },
      {
        name: 'stop',
        pattern: '<service>',
        about: 'Stop a service'
      },
      // list of services
      {
        name: 'list',
        pattern: '<service...>',
        about: 'List service(s)'
      },
      // multiple arguments
      {
        name: 'multi',
        arguments: '<one> <two> <three>',
        about: 'Stop a service'
      },
      {
        name: 'status',
        about: 'Show service status'
      }
    ]
  });
  console.log('config: ', config);
}
main();
