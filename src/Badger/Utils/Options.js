import process from 'node:process';
import prompter from 'prompts'
import { Command } from 'commander';
import { color } from './Color.js';
import { fail, hasValue, splitList } from '@abw/badger-utils';

export const defaults = {
  verboseColor:     'magenta',
  titleColor:       'bright yellow',
  underlineColor:   'dark yellow',
  infoColor:        'cyan',
  tickColor:        'green',
  questionColor:    'bright white',
  answerColor:      'bright green',
  sectionNewlines:  true
};

export const options = async config => {
  const vcol = color(options.verboseColor || defaults.verboseColor);
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
  if (config.quiet) {
    command.option('-q, --quiet', 'Quiet output')
  }

  // add in other command line options
  config.options
    ?.filter(
      option => {
        if (hasValue(option.arg) && ! option.arg) {
          // allow arg: false to indicate no command line argument
          return false;
        }
        if (option.title) {
          // section break
          return;
        }
        return hasValue(option.name);
      }
    )
    .forEach(
      option => {
        const name    = option.name;
        const about   = option.about;
        const deflt   = option.default;
        const handler = option.handler;
        const short   = option.short;
        const type    = option.type;
        const pattern = option.pattern || (hasValue(type) ? `<${type}>` : undefined);
        let string    = `--${name}`;
        let args      = [];
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
        if (hasValue(handler)) {
          args.push(handler);
        }
        if (hasValue(deflt)) {
          args.push(deflt);
        }
        command.option(...args)
      }
    )

  let commands = { };

  config.commands?.forEach(
    option => {
      const name    = option.name;
      const about   = option.about;
      const type    = option.type;
      const pattern = option.pattern || (hasValue(type) ? `<${type}>` : undefined);
      let   args    = [];
      let   string  = name;
      let   cmd     = command.command(string)
      if (hasValue(pattern)) {
        cmd.argument(pattern);
      }
      if (hasValue(about)) {
        cmd.description(about);
      }
      if (hasValue(option.arguments)) {
        splitList(option.arguments).forEach(
          argument => {
            args.push(matchArgName(argument));
            cmd.argument(argument)
          }
        )
      }
      cmd.action(
        (...values) => {
          commands[name] = args.length
            ? args.reduce(
              (opts, arg) => {
                opts[arg] = values.shift()
                return opts;
              },
              { }
            )
            : values[0]
        }
      )
      //console.log({ args });
      //command.command(...args)
    }
  )

  // parse the command line arguments
  command.parse();
  const cmdline = command.opts();

  // if the -y / --yes option has been specified then accept all
  // default answers automatically
  const yes     = config.yes && cmdline.yes;
  const verbose = config.verbose && cmdline.verbose;
  const quiet   = config.quiet && cmdline.quiet;

  if (yes) {
    if (verbose && ! quiet) {
      process.stdout.write(vcol('Accepting default answers (-y option is set)\n'))
    }
    prompter.override(cmdline);
  }

  // build up the list of prompts for interactive questions
  let prompts = [ ];
  config.options?.forEach(
    option => {
      const type     = option.type || 'text';
      const name     = option.name;
      const prompt   = option.prompt;
      const noArg    = hasValue(option.arg) && ! option.arg;
      const validate = option.validate ||
        (option.required
          ? value => (hasValue(value) && value.toString().length)
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
          // console.log('looking up select option for [%s]', initial);
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
            type: (
              hasValue(initial)
                ? () => {
                  yes && (quiet || answer({ question: prompt, answer: initial }));
                  return type;
                }
                : type
            ),
            name,
            message: prompt,
            initial: initial,
            validate: validate,
          },
        )
      }
      else if (option.title || option.info) {
        prompts.push(
          {
            type: () => {
              quiet || section(option);
              return false;
            }
          }
        );
      }
    }
  );

  // prompt the user to answer/confirm questions
  let cancelled = false;
  const answers = await prompter(
    prompts,
    {
      onCancel: () => {
        cancelled = true;
        return false;
      }
    }
  );

  return cancelled
    ? undefined
    : {
      ...cmdline, ...answers, ...commands
    }
}

function matchArgName(argument) {
  const match = argument.match(/(\w+)/);
  if (! match) {
    fail("Can't parse argument name: ", argument);
  }
  return match[1];
}

export const section = option => {
  const title = option.title;
  const tcol  = color(option.titleColor || defaults.titleColor);
  const ucol  = color(option.underlineColor || defaults.underlineColor);
  const icol  = color(option.infoColor || defaults.infoColor);
  const nl    = (hasValue(option.newlines) ? option.newlines : defaults.sectionNewlines) ? "\n" : "";

  if (title) {
    const uline = '-'.repeat(title.length);
    process.stdout.write(nl + tcol(title) + "\n" + ucol(uline) + "\n" + nl);
  }

  if (option.info) {
    process.stdout.write(icol(option.info) + "\n" + nl);
  }
}

export const answer = option => {
  const tcol  = color(option.tickColor || defaults.tickColor);
  const qcol  = color(option.questionColor || defaults.questionColor);
  const acol  = color(option.answerColor || defaults.answerColor);
  process.stdout.write(tcol("✔ ") + qcol(option.question) + " " + acol(option.answer) + "\n");
}

export default options