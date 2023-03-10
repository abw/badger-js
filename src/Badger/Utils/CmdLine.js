import { fail, hasValue, isArray, splitHash } from '@abw/badger-utils';
import process from 'node:process'
import { prompt } from './Prompt.js';

export const cmdLine = () => process.argv.slice(2);

export function cmdLineFlags(config, args) {
  // allow config and/or args to be undefined, and also allow an array of
  // arguments to be passed as the first argument
  if (! config) {
    config = { }
  }
  else if (isArray(config)) {
    args = config;
    config = { };
  }
  if (! args) {
    args ||= cmdLine()
  }

  const options = config.options ? splitHash(config.options) : false;
  const others  = config.others || 'error';
  const short   = config.short || { };
  const on      = config.on || { }
  let   n       = 0;
  let   flags   = { };

  while (n < args.length) {
    const match = args[n].match(/^-(-)?(.*)/);
    if (match) {
      const long = match[1] === '-';
      const name = (! long && hasValue(short[match[2]]))
        ? short[match[2]]
        : match[2];

      if (on[name]) {
        if (on[name](name, args.splice(n, 1)[0], args, flags)) {
          continue;
        }
        else {
          args.splice(n, 0, match[0]);
        }
      }

      if (options && ! options[name]) {
        switch (others) {
          case 'collect':
            break
          case 'remove':
            args.splice(n, 1)[0];
          // eslint-disable-next-line no-fallthrough
          case 'keep':
            n++;
            continue;
          case 'error':
            return fail(`Invalid command line flag: ${match[0]}`);
          default:
            return fail(`Invalid "others" option: ${others}`)
        }
      }

      args.splice(n, 1);
      flags[name] = true;
    }
    else {
      n++;
    }
  }
  return { flags, args }
}

export async function cmdLineArg(argPrompt, args=cmdLine()) {
  if (args.length) {
    return args.shift();
  }
  else if (argPrompt) {
    return await prompt(argPrompt);
  }
  return undefined;
}

export async function cmdLineArgs(argPrompts, args=cmdLine()) {
  let results = [ ];
  if (argPrompts) {
    for (let argPrompt of argPrompts) {
      const response = await cmdLineArg(argPrompt, args);
      if (! response?.length) {
        return undefined;
      }
      results.push(response);
    }
    return results;
  }
  else {
    return args;
  }
}