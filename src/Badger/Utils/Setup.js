import options from './Options.js';
import process from 'node:process'
import dotenv from 'dotenv'
import { cwd, dir } from '@abw/badger-filesystem';
import { fail, hasValue, isBoolean, splitLines, splitList } from '@abw/badger-utils';
import { brightGreen, brightRed, brightYellow } from './Color.js';
import { now } from '@abw/badger-timestamp';
import { quit } from './Exit.js';
import { appStatus } from './AppStatus.js';

const defaults = {
  description:  'Project setup script.',
  configFiles:  [
    'config/setup.yaml', 'config/setup.json',
    'setup.yaml', 'setup.json',
    '.setup.yaml', '.setup.json'
  ],
  dataFile:     '.env.yaml',
  envFile:      '.env',
  envComments:  true,
  envSections:  true,
  writeData:    true,
  writeEnv:     false,
  compact:      false,
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

export const setup = appStatus(
  async config => {
    await runSetup(config)
  }
)

export async function runSetup(props) {
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

  // look for a setup file - if it's provided as configFile then it's treated
  // as definitive, otherwise we look for the first of configFiles
  const configFile = config.configFile
    ? rootDir.file(config.configFile, { codec: 'auto' })
    : await findFirstFile(rootDir, config.configFiles);

  // read the setup file
  const setup = await configFile.read();

  setup.name        ||= config.name
                    ||  process.argv[1].replace(rootDir.path() + '/', '');
  setup.version     ||= config.version;
  setup.description ||= config.description;

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

    // the type is nearly always 'text'
    option.type ||= 'text';

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
      option.pattern ||= '<path>'
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
    await envFile.write(
      await envFileText(rootDir, config, setup, answers)
    )
    if (verbose) {
      console.log(brightGreen(`✓ Wrote .env file: ${envFile}`));
    }
  }

  return answers;
}

export async function findFirstFile(root, names=[]) {
  for (let name of names) {
    const file = root.file(name, { codec: 'auto' });
    if (await file.exists()) {
      return file;
    }
  }
  fail("Can't find a configFile: ", names.join(', '));
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

async function envFileText(rootDir, config, setup, answers) {
  const { compact, envComments, envSections } = config;
  const gap = compact ? '' : "\n";
  let output = [
    comment(config.warning(config))
  ];
  const line  = '#' + '-'.repeat(77)
  const line2 = '#' + '='.repeat(77)
  for (let option of setup.options) {
    const { name, envvar, title, about, save } = option
    if (isBoolean(save) && ! save) {
      continue;
    }
    if (title && envSections) {
      output.push(
        `${gap}\n${line}\n${comment(title)}\n${line}`
      )
      continue;
    }
    if (! compact) {
      output.push("");
    }
    if (about && envComments) {
      output.push(`${comment(about)}`)
    }
    if (name) {
      const value = answers[name];
      const safe = value.toString().match(/[#\r\n]/) ? `"$value"` : value;
      output.push(`${envvar || name.toUpperCase()}=${safe}`)
    }
  }
  if (config.envExtra) {
    const extraFile = rootDir.file(config.envExtra);
    if (! await extraFile.exists()) {
      fail(`Cannot find envExtra file: ${config.envExtra}`);
    }
    if (envSections) {
      output.push(
        "\n",
        line2,
        comment(` Additional configuration copied from ${config.envExtra}`),
        line2,
        "",
      )
    }
    output.push(await extraFile.read())
  }
  return output.join("\n") + "\n";
}

function comment(text) {
  return splitLines(text.trim())
    .map( line => line.match(/^#/) ? line : `# ${line}` )
    .join("\n");
}