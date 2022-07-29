import { options } from '../src/Badger/Utils/Options.js'

// example showing use of options()

const main = async () => {
  const config = await options({
    name: 'options.js',
    description: 'CLI to test command line options and prompting',
    version: '0.0.1',
    yes: true,
    verbose: true,
    options: [
      {
        name:     'name',
        short:    'n',
        about:    'Your name',
        default:  'Mr Badger',
        pattern:  '<name>',
        prompt:   'What is your name?'
      },
      {
        name:     'age',
        short:    'a',
        about:    'Your age',
        pattern:  '<number>',
        prompt:   'How old are you?',
        required: true
      },
      {
        arg:      false,
        type:     'toggle',
        name:     'badgers',
        prompt:   'Do you like badgers?',
        default:  true,
        active:   'yes',
        inactive: 'no',
        validate:  value => value || 'You must like badgers',
      },
      {
        arg:      false,
        type:     'select',
        name:     'color',
        prompt:   'Pick a color',
        pattern:  '<red|green|blue>',
        default:  'blue',
        choices: [
          { title: 'Red',     value: 'red' },
          { title: 'Green',   value: 'green' },
          { title: 'Blue',    value: 'blue' },
          { title: 'Orange',  value: 'orange', disabled: true }
        ],
      }
    ]
  });
  console.log('config: ', config);
}

main();
