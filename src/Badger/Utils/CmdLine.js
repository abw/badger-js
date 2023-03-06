import process from 'node:process'
import { prompt } from './Prompt.js';

// quick hacks - use with caution
export async function cmdLineArg(argPrompt, args=process.argv.slice(2)) {
  if (args.length) {
    return args.shift();
  }
  else if (argPrompt) {
    return await prompt(argPrompt);
  }
  return undefined;
}

export async function cmdLineArgs(argPrompts, args=process.argv.slice(2)) {
  let results = [ ];
  for (let argPrompt of argPrompts) {
    const response = await cmdLineArg(argPrompt, args);
    if (! response?.length) {
      return undefined;
    }
    results.push(response);
  }
  return results;
}