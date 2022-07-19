import { isString, isArray } from "./Misc.js";

/**
 * Split a comma/whitespace delimited string into an Array
 * @param {String} [value] - string to split
 * @return {Array} array of split strings
 * @example
 * const strings = splitList('one two three')
 * @example
 * const strings = splitList('one,two,three')
 * @example
 * const strings = splitList('one, two, three')
 */
export function splitList(value) {
  return isString(value)
    ? value.split(/,\s*|\s+/)
    : isArray(value)
      ? value
      : [value];
}

/**
 * Join an Array into a single string
 * @param {Array} [array] - array to join
 * @param {String} [joint=' '] - delimiter to join strings
 * @param {String} [lastJoint=joint] - delimiter for final item
 * @return {String} joined string
 * @example
 * joinList(['one', 'two', 'three']);   // one two three
 * @example
 * joinList(['one', 'two', 'three'], ', ');   // one, two, three
 * @example
 * joinList(['one', 'two', 'three'], ', ', ' and ');   // one, two and three
 */
export function joinList(array, joint=' ', lastJoint=joint) {
  let copy = [...array];
  const last = copy.pop();
  return copy.length
    ? [copy.join(joint), last].join(lastJoint)
    : last;
}

/**
 * Join an Array into a single string using commas for delimiters and ` and ` for the final item
 * @param {Array} [array] - array to join
 * @param {String} [joint=', '] - delimiter to join strings
 * @param {String} [lastJoint=' and '] - delimiter for final item
 * @return {String} joined string
 * @example
 * joinListAnd(['one', 'two', 'three']);   // one, two and three
 */
export function joinListAnd(array, joint=', ', lastJoint=' and ') {
  return joinList(array, joint, lastJoint);
}

/**
 * Join an Array into a single string using commas for delimiters and ` or ` for the final item
 * @param {Array} [array] - array to join
 * @param {String} [joint=', '] - delimiter to join strings
 * @param {String} [lastJoint=' or '] - delimiter for final item
 * @return {String} joined string
 * @example
 * joinListOr(['one', 'two', 'three']);   // one, two or three
 */
export function joinListOr(array, joint=', ', lastJoint=' or ') {
  return joinList(array, joint, lastJoint);
}

/**
 * Capitalise a string by converting the first character to upper case and other characters to lower case
 * @param {String} [word] - word to capitalise
 * @return {String} capitalised string
 * @example
 * capitalise('badger');   // Badger
 * @example
 * capitalise('BADGER');   // Badger
 */
export function capitalise(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Convert a snake case string to studly caps
 * @param {String} [snake] - word to capitalise
 * @return {String} capitalised string
 * @example
 * snakeToStudly('happy_badger_dance');   // HappyBadgerDance
 * @example
 * snakeToStudly('happy_badger/dance');   // HappyBadger/Dance
 */
export function snakeToStudly(snake) {
  return snake.split('/').map(
    // each segment can be like foo_bar which we convert to FooBar
    segment => segment.split('_').map(capitalise).join('')
  ).join('/');
}

/**
 * Convert a snake case string to camel case
 * @param {String} [snake] - word to capitalise
 * @return {String} capitalised string
 * @example
 * snakeToCamel('happy_badger_dance');   // happyBadgerDance
 * @example
 * snakeToCamel('happy_badger/dance');   // happyBadger/dance
 */
export function snakeToCamel(snake) {
  return snake.split('/').map(
    // each segment can be like foo_bar which we convert to fooBar
    segment => segment.split('_').map((i, n) => n ? capitalise(i) : i).join('')
  ).join('/');
}
