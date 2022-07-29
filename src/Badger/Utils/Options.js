import process from 'node:process';
import prompter from 'prompts'
import { Command } from 'commander';
import { color } from './Color.js';
import { hasValue } from './Misc.js';

const defaults = {
  verboseColor: 'magenta',
};

export const options = async config => {
  const verbose = color(options.verboseColor || defaults.verboseColor);
  const command = new Command;

  // set command name, description and version
  if (config.name) {
    command.name(config.name);
  }
  if (config.description) {
    command.description(config.description);
  }
  if (config.version) {
    command.version(config.version);
  }

  // define the -y / -yes and -v / --verbose options
  if (config.yes) {
    command.option('-y, --yes', 'Accept default answers')
  }
  if (config.verbose) {
    command.option('-v, --verbose', 'Verbose output')
  }

  // add in other command line options
  config.options.map(
    option => {
      const name    = option.name;
      const about   = option.about;
      const deflt   = option.default;
      const short   = option.short;
      const type    = option.type;
      const pattern = option.pattern || (hasValue(type) && `<${type}>`);
      let string    = `--${name}`;
      let args      = [];
      if (hasValue(option.arg) && ! option.arg) {
        // allow arg: false to indicate no command line argument
        return;
      }
      if (hasValue(short)) {
        string = `-${short}, ${string}`;
      }
      if (hasValue(pattern)) {
        string = `${string} ${pattern}`;
      }
      args.push(string);
      if (hasValue(about)) {
        args.push(about);
      }
      if (hasValue(deflt)) {
        args.push(deflt);
      }
      command.option(...args)
    }
  )

  // parse the command line arguments
  command.parse();
  const cmdline = command.opts();

  // if the -y / --yes option has been specified then accept all
  // default answers automatically
  if (config.yes && cmdline.yes) {
    if (config.verbose && cmdline.verbose) {
      process.stdout.write(verbose('Accepting default answers (-y option is set)\n'))
    }
    prompter.override(cmdline);
  }

  // build up the list of prompts for interactive questions
  let prompts = [ ];
  config.options.map(
    option => {
      const type     = option.type || 'text';
      const name     = option.name;
      const prompt   = option.prompt;
      const noArg    = hasValue(option.arg) && ! option.arg;
      const validate = option.validate ||
        (option.required
          ? value => (hasValue(value) && value.length)
            ? true
            : (options.invalid || `You must enter a value for ${name}`)
          : undefined
        )

      // special process for initial
      // - use cmdline[name]
      // - or if noArg, use option.default
      // - if a select list and not a number, find the index
      let initial = noArg ? option.default : cmdline[name];
      if (type === 'select' && hasValue(initial)) {
        if (! Number.isInteger(initial)) {
          console.log('looking up select option for [%s]', initial);
          initial = option.choices?.findIndex( i => i.value === initial );
          if (initial < 0) {
            initial = 0;
          }
        }
      }

      if (hasValue(prompt)) {
        prompts.push(
          {
            ...option,
            type,
            name,
            message: prompt,
            initial: initial,
            validate: validate,
          },
        )
      }
    }
  );

  // prompt the user to answer/confirm questions
  const answers = await prompter(prompts);

  return {
    ...cmdline, ...answers
  }
}

export default options