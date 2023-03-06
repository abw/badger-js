import { isString } from '@abw/badger-utils';
import prompts from 'prompts'

/**
 * Prompt user to enter a value.
 * @param {String} question - question to prompt user to answer
 * @param {Object} [options] - optional options
 * @param {String} [options.default] - default value returned if user presses RETURN
 * @return {Promise} fulfills with response to question or default value
 * @example
 * prompt("What is your name?")
 *   .then( name => console.log(`Hello ${name}`) );
 * @example
 * prompt("What is your name?", { default: 'Mr.Badger' })
 *   .then( name => console.log(`Hello ${name}`) );
 */
export const prompt = async (question, options={}) => {
  options = isString(options)
    ? { default: options }
    : options;

  const name = options.name || 'answer';
  const answers = await prompts([
    {
      name,
      type: options.type || 'text',
      message: question,
      initial: options.default,
    },
  ]);
  return answers[name];
}

/**
 * Prompt user to confirm a choice.
 * @param {String} question - question to prompt user to answer
 * @param {Object} [options] - optional options
 * @param {String} [options.default] - default value returned if user presses RETURN
 * @return {Promise} fulfills with response to question or default value
 * @example
 * confirm("Are you sure?")
 *   .then( yes => console.log('You said "%s"', yes ? 'YES' : 'NO') );
 */
export const confirm = async (question, options={}) =>
  prompt(question, { ...options, type: 'confirm' });

export default prompt