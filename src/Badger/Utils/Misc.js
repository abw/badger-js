/**
 * Determines if a value is a string
 * @param {String} value - value to test
 * @return {Boolean} true if `value` is a string or false if not
 */
export function isString(value) {
  return typeof value === 'string';
}

/**
 * Determines if a value is an array
 * @param {Array} value - value to test
 * @return {Boolean} true if `value` is an Array or false if not
 */
export function isArray(value) {
  return Array.isArray(value);
}

/**
 * Determines if a value is a Function
 * @param {Function} value - value to test
 * @return {Boolean} true if `value` is a Function or false if not
 */
export function isFunction(value) {
  return typeof value === 'function'
}

/**
 * Determines if a value is an Object (but not an Array)
 * @param {Object} value - value to test
 * @return {Boolean} true if `value` is an Object or false if not
 */
export function isObject(value) {
  return typeof value === "object"
    && ! isArray(value)
    && ! isNull(value);
}

/**
 * Determines if a value is `undefined`
 * @param {any} value - value to test
 * @return {Boolean} true if `value` is `undefined` or false if not
 */
export function isUndefined(value) {
  return typeof value === 'undefined';
}

/**
 * Determines if a value is `null`
 * @param {any} value - value to test
 * @return {Boolean} true if `value` is `null` or false if not
 */
export function isNull(value) {
  return value === null;
}

/**
 * Determines if a value is defined and not null
 * @param {any} value - value to test
 * @return {Boolean} true if `value` is not `undefined` or `null`
 */
export function hasValue(value) {
  return ! (isUndefined(value) || isNull(value));
}

/**
 * Determines if all values are defined and not null
 * @param {any[]} values - values to test
 * @return {Boolean} true if all values are not `undefined` or `null`
 */
export function haveValue(...values) {
  return values.every( value => hasValue(value) );
}

/**
 * Determines if a value is undefined or null
 * @param {any} value - value to test
 * @return {Boolean} true if `value` is `undefined` or `null`
 */
export function noValue(value) {
  return ! hasValue(value);
}

/**
 * Throws a new Error object
 * @param {String[]} message - error message string(s)
 * @throws {Error}
 */
export function fail(...message) {
  throw new Error(message.join(''));
}

/**
 * Re-throw an existing Error object
 * @param {Error} error - error object
 * @throws {Error}
 */
export function rethrow(error) {
  throw error;
}

/**
 * Do nothing.  Nothing at all.
 */
export function doNothing() {
  // speak again Cordelia
}