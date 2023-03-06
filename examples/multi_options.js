import { options } from '../src/Badger/Utils/Options.js'

// example showing use of options()

const main = async () => {
  const config = await options({
    name: 'multi_options.js',
    description: 'CLI to test command line options and prompting',
    version: '0.0.1',
    yes: true,
    verbose: true,
    quiet: true,
    options: [
      {
        name:     'color',
        short:    'c',
        about:    'A color',
        pattern:  '<color>',
        default:  [],
        handler:  (color, list) => {
          console.log(`got color ${color} to add to list`, list);
          // return list.concat([color])
        },

        // handler:  (color, list) => list.concat([color]),
        prompt:   'Name a color',
      },
    ]
  });
  console.log('config: ', config);
}
main();
