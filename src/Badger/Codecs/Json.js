/**
 * Function to encode JSON
 * @param {Object} data - The data to encode as JSON text
 * @return {String} a JSON encoded string
 * @example
 * encode({ message: 'Hello World' })
 */
export const encode = data => JSON.stringify(data);

/**
 * Function to decode JSON
 * @param {String} text - The JSON text to decode
 * @return {Object|Array} the decoded object or array
 * @example
 * decode("{ message: 'Hello World' }")
 */
export const decode = text => JSON.parse(text);

/**
 * An object containing the JSON `encode` and `decode` functions
 */
export const codec = { encode, decode };

export default codec
