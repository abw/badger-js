import { isArray, isBoolean, isString } from '@abw/badger-utils';
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
export const confirm = async (question, options={}) => {
  options = isBoolean(options)
    ? { default: options }
    : options;
  return prompt(
    question,
    { ...options, type: 'confirm' });
}

/**
 * Prompt user to select an option.
 * @param {String} question - question to prompt user to answer
 * @param {Object} choices - array of title and value or object mapping value to title
 * @param {String} [initial] - initial value
 * @return {Promise} fulfills with selected option value
 * @example
 * select("Pick a colour", { red: 'Red', green: 'Green', blue: 'Blue'})
 *   .then( colour => console.log('You chose "%s"', colour) );
 * @example
 * select(
 *   "Pick a colour",
 *   [
 *     { value: 'red':   title: 'Red' },
 *     { value: 'green', title: 'Green' },
 *     { value: 'blue',  title: 'Blue' },
 *   ],
 *   0
 * ).then( colour => console.log('You chose "%s"', colour) );
 */

export const select = async (message, choices, initial) => {
  const choice = await prompts([
    {
      type: 'select',
      name: 'selected',
      message,
      initial,
      choices: isArray(choices)
        ? choices
        : Object.entries(choices).map(
          ([value, title]) => ({ value, title }),
        )
    }
  ]);
  return choice.selected;
}
