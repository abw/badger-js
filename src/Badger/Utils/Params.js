import { hasValue, fail } from "./Misc.js";
import { joinListOr, splitList } from "./Text.js";

/**
 * Assert that a parameter object contains an item with a defined/non-null value
 * @param {Object} params={} - parameters object
 * @param {String} name - parameter that must be included
 * @return {any} the parameter value
 * @throws {Error} if the parameter is not defined or null
 * @example
 * const foo = requiredParam({ foo: 10 }, 'foo');
 */
export function requiredParam(params={}, name) {
  const value = params[name];
  if (hasValue(value)) {
    return value;
  }
  else {
    fail("Missing value for required parameter: ", name);
  }
}

/**
 * Assert that a parameter object contains all specified item with a defined/non-null value
 * @param {Object} params={} - parameters object
 * @param {Array|String} names - parameters that must be included, as an Array or whitespace/comma delimited string (see {@link splitList})
 * @return {Array} the parameter values
 * @throws {Error} if any parameter is not defined or null
 * @example
 * const [foo, bar] = requiredParams({ foo: 10, bar: 20 }, 'foo bar');
 */
export function requiredParams(params={}, names) {
  return splitList(names).map( name => requiredParam(params, name) );
}

/**
 * An alias for {@link requiredParams} for people who don't like typing long names (and for symmetry with {@link anyParams}))
 */
export const allParams=requiredParams;

/**
 * Assert that a parameter object contains any of the specified items with a defined/non-null value
 * @param {Object} params={} - parameters object
 * @param {Array|String} names - parameters of which at least one must be included, as an Array or whitespace/comma delimited string (see {@link splitList})
 * @return {Array} the parameter values
 * @throws {Error} if any parameter is not defined or null
 * @example
 * const [foo, bar] = anyParams({ foo: 10, wiz: 99 }, 'foo bar');
 */
export function anyParams(params, names) {
  let found = false;
  const nlist  = splitList(names);
  const values = nlist.map(
    name => {
      const value = params[name];
      if (hasValue(value)) {
        found = true;
      }
      return value;
    }
  );
  return found
    ? values
    : fail("Missing value for one of: ", joinListOr(nlist));
}
