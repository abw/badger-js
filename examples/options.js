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
    options: [
      {
        title: "Configuration Options",
        info:  "Please answer the following questions.\nPress RETURN to accept defaults."
      },
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
        title: "Database Configuration",
        info: "Please enter details about the database configuration.",
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
      {
        title: "More Questions",
        info: "We are going to ask you some more questions now",
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
