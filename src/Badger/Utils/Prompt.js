import process from 'node:process';
import readline from 'node:readline';
import { color, ANSIescape, ANSIreset } from './Color.js';
import { hasValue } from './Misc.js';

/**
 * Default prompt colors and options.
 */
const defaults = {
  questionColor:  'cyan',
  defaultColor:   'yellow',
  separatorColor: 'dark grey',
  answerColor:    'green',
  separator:      '> ',
}

/**
 * Prompt user to enter a value.
 * @param {String} question - question to prompt user to answer
 * @param {Object} [options] - optional options
 * @param {String} [options.default] - default value returned if user presses RETURN
 * @param {String} [options.value] - pre-defined value to use as answer
 * @param {String} [options.color=cyan] - color to display question
 * @param {String} [options.defaultColor=green] - color to display default value
 * @return {Promise} fulfills with response to question or default value
 * @example
 * prompt("What is your name?")
 *   .then( name => console.log(`Hello ${name}`) );
 * @example
 * prompt("What is your name?", { default: 'Mr.Badger' })
 *   .then( name => console.log(`Hello ${name}`) );
 * @example
 * prompt("What is your name?", { default: 'Mr.Badger', color: 'yellow', defaultColor: 'cyan' })
 *   .then( name => console.log(`Hello ${name}`) );
 */
export const prompt = (question, options={}) => {
  return hasValue(options.value)
    ? answer(question, options, options.value)
    : ask(question, options)
}


/**
 * Prompt user to answer a series of questions
 * @param {Array} questions - array of questions
 * @param {Object} [options] - configuration options
 */
export const prompts = async (questions, options) => {
  let config = { };

  return Object.entries(questions).reduce(
    (p, [item, question]) => p.then(
      async config => {
        const [qtext, qopts={}] = question;
        config[item] = await prompt(qtext, { ...options, ...qopts });
        return config;
      }
    ),
    Promise.resolve(config)
  );
};

/**
 * Format a question using colors
 * @param {Array} question - text of question
 * @param {Object} [options] - configuration options
 * @param {String} [options.separator=':' ] - separator text between question and answer
 * @param {String} [options.color] - main question color
 * @param {String} [options.defaultColor] - color for default answer
 * @param {String} [options.separatorColor] - color for separator
 */
const formatQuestion = (question, options={}) => {
  const qcol = color(options.color || defaults.questionColor);
  const dcol = color(options.defaultColor || defaults.defaultColor);
  const scol = color(options.separatorColor || defaults.separatorColor);
  return qcol(question) +
    (options.default?.length ? scol(' [') + dcol(options.default) + scol('] ') : ' ') +
    scol(options.separator || defaults.separator)
}

/**
 * Use readline to prompt user with question and read answer
 * @param {Array} question - text of question
 * @param {Object} [options] - configuration options
 * @param {String} [options.separator=':' ] - separator text between question and answer
 * @param {String} [options.color] - main question color
 * @param {String} [options.defaultColor] - color for default answer
 * @param {String} [options.separatorColor] - color for separator
 * @param {String} [options.answerColor] - color for answer
 */
const ask = (question, options={}) => {
  const acol = options.answerColor || defaults.answerColor;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(
    resolve =>
      rl.question(
        formatQuestion(question, options) + ANSIescape(acol),
        answer => {
          rl.close();
          process.stdout.write(ANSIreset())
          resolve(answer.length ? answer : (options.default || undefined));
        }
      )
  );
}

/**
 * Display question with pre-defined answer
 * @param {Array} question - text of question
 * @param {Object} [options] - configuration options
 * @param {String} [options.separator=':' ] - separator text between question and answer
 * @param {String} [options.color] - main question color
 * @param {String} [options.defaultColor] - color for default answer
 * @param {String} [options.separatorColor] - color for separator
 * @param {String} [options.answerColor] - color for answer
 * @param {String} value - answer value
 */
const answer = (question, options={}, value) => {
  const acol = color(options.answerColor || defaults.answerColor);
  return new Promise(
    resolve => {
      process.stdout.write(
        formatQuestion(question, options) + acol(value) + "\n"
      );
      resolve(options.value);
    }
  );
}


export default prompt