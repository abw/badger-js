/**
 * Function to encode JSON
 * @param {string} data - The data to encode as JSON text
 */
export const encode = data => JSON.stringify(data);

/**
 * Function to decode JSON
 * @param {string} json - The JSON text to decode
 */
export const decode = json => JSON.parse(json);

/**
 * An object containing the JSON `encode` and `decode` functions
 */
export const codec = { encode, decode };

export default codec
