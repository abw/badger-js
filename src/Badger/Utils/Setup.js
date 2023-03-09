import options from './Options.js';
import process from 'node:process'
import dotenv from 'dotenv'
import { cwd, dir } from '@abw/badger-filesystem';
import { hasValue, isBoolean, splitLines, splitList } from '@abw/badger-utils';
import { brightGreen, brightRed, brightYellow } from './Color.js';
import { now } from '@abw/badger-timestamp';
import { quit } from './Exit.js';

process.on('SIGINT', function() {
  console.log("Caught interrupt signal");
  process.exit();
});

const defaults = {
  scriptName:   'bin/setup.js',
  configFile:   'config/setup.yaml',
  dataFile:     '.env.yaml',
  envFile:      '.env',
  writeData:    true,
  writeEnv:     false,
  cancelled:    'Setup cancelled',
  allDone:      'All configuration options have been set',
  warning:      config => `
#=============================================================================
# WARNING: This file is generated automatically when the ${config.scriptName}
# script is run.  Any changes made here may be lost.
#
# Generated: ${now()}
#=============================================================================

`
}

export async function setup(props) {
  const config = { ...defaults, ...props };
  const rootDir = config.rootDir
    ? dir(config.rootDir)
    : cwd();

  // read the environment file (.env) if it exists
  const envFile  = rootDir.file(config.envFile);
  dotenv.config({ path: envFile.path() });
  const env = process.env;

  // read the data file (.env.yaml) if it exists
  const dataFile = rootDir.file(config.dataFile, { codec: 'auto' });
  const data = (await dataFile.exists())
    ? await dataFile.read()
    : { };

  // read the setup file
  const setup = await rootDir
    .file(config.configFile, { codec: 'auto' })
    .read();

  // caller may have provided us with some values
  const values = {
    root: rootDir.path(),
    ...(config.values || { })
  };

  // process the options
  for (let option of setup.options) {
    const name = option.name;

    // section headings don't have names
    if (! name) {
      continue;
    }

    // look to see if we've got a value in the environment or data file
    const envVar  = option.envvar ||= name.toUpperCase();

    if (hasValue(env[envVar])) {
      // set the value from the environment
      option.default = env[envVar];
    }
    else if (hasValue(data[name])) {
      // set the value from the data file
      option.default = data[name];
    }
    else if (hasValue(values[name])) {
      // set the value from the data file
      option.default = values[name];
    }
    else if (option.program) {
      // look for a program in the path
      option.default = await findProgram(option.program)
    }
  }

  // Read command line arguments or prompt user to enter values
  const answers = await options(setup);
  if (! answers) {
    quit('\n👎 ' + brightRed(config.cancelled));
  }

  // extract the options that shouldn't be preserved
  const { debug, verbose, quiet } = answers;
  delete answers.quiet
  delete answers.verbose
  delete answers.yes

  if (debug) {
    // console.log('\nGenerated configuration:', data);
  }
  if (config.allDone && ! quiet) {
    console.log('\n👍 ', brightYellow(config.allDone), '\n');
  }

  if (config.writeData) {
    await dataFile.write(answers);
    if (verbose) {
      console.log(brightGreen(`✓ Wrote data file: ${dataFile}`));
    }
  }

  if (config.writeEnv) {
    await envFile.write(envFileText(config, setup, answers))
    if (verbose) {
      console.log(brightGreen(`✓ Wrote .env file: ${envFile}`));
    }
  }

  return answers;
}

export async function findProgram(names) {
  for (let name of splitList(names)) {
    for (let path of process.env.PATH.split(':')) {
      const file   = dir(path).file(name);
      const exists = await file.exists();
      if (exists) {
        return file.path();
      }
    }
  }
}

function envFileText(config, setup, answers) {
  let output = [
    comment(config.warning(config))
  ];
  const line = '#' + '-'.repeat(77)
  for (let option of setup.options) {
    const { name, envvar, title, about, save } = option
    if (isBoolean(save) && ! save) {
      continue;
    }
    if (title) {
      output.push(
        `\n\n${line}\n${comment(title)}\n${line}`
      )
      continue;
    }
    if (about) {
      output.push(`\n${comment(about)}`)
    }
    if (name) {
      const value = answers[name];
      const safe = value.toString().match(/[#\r\n]/) ? `"$value"` : value;
      output.push(`${envvar || name.toUpperCase()}=${safe}`)
    }
  }
  return output.join("\n") + "\n";
}

function comment(text) {
  return splitLines(text.trim())
    .map( line => line.match(/^#/) ? line : `# ${line}` )
    .join("\n");
}