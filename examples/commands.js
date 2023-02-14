import { options } from '../src/Badger/Utils/Options.js'

// example showing use of options()

const main = async () => {
  const config = await options({
    name: 'options.js',
    description: 'CLI to test command line options and prompting',
    version: '0.0.1',
    yes: true,
    verbose: true,
    quiet: true,
    commands: [
      {
        name: 'start',
        pattern: '<service...>',
        about: 'Start a service'
      }
    ]
  });
  console.log('config: ', config);
}
main();
