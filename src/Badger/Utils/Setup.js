import options from './Options.js';
import process from 'node:process'
import dotenv from 'dotenv'
import { cwd, dir } from '@abw/badger-filesystem';
import { hasValue, isBoolean, splitList } from '@abw/badger-utils';
import { brightGreen, brightYellow } from './Color.js';

const defaults = {
  configFile:   'config/setup.yaml',
  dataFile:     '.env.yaml',
  envFile:      '.env',
  writeData:    true,
  writeEnv:     false,
  allDone:      'All configuration options have been set'
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

  // process the options
  for (let option of setup.options) {
    const name = option.name;

    // section headings don't have names
    if (! name) {
      continue;
    }

    // look to see if we've got a value in the environment or data file
    const envVal  = env[name.toUpperCase()];
    const dataVal = data[name];

    if (hasValue(envVal)) {
      // set the value from the environment
      option.default = envVal;
    }
    else if (hasValue(dataVal)) {
      // set the value from the data file
      option.default = dataVal;
    }
    else if (option.program) {
      // look for a program in the path
      option.default = await findProgram(option.program)
    }
  }

  // Read command line arguments or prompt user to enter values
  const answers = await options(setup);

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
    await envFile.write(envFileText(setup, answers))
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

function envFileText(setup, answers) {
  let output = [ ];
  const line = '-'.repeat(72)
  for (let option of setup.options) {
    const { name, title, about, save } = option
    if (isBoolean(save) && ! save) {
      continue;
    }
    if (title) {
      output.push(`${output.length ? "\n\n" : ''}#${line}\n# ${title}\n#${line}`)
      continue;
    }
    if (about) {
      output.push(`\n# ${about}`)
    }
    if (name) {
      const value = answers[name];
      const safe = value.toString().match(/[#\r\n]/) ? `"$value"` : value;
      output.push(`${name.toUpperCase()}=${safe}`)
    }
  }
  return output.join("\n") + "\n";
}

