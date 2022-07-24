// simple wrapper around JSON load/dump
import yaml from 'js-yaml';

/**
 * Function to encode YAML
 * @param {Object} data - The data to encode as YAML text
 * @return {String} a YAML encoded string
 * @example
 * encode({ message: 'Hello World' })
 */
const encode = data => yaml.dump(data);

/**
 * Function to decode YAML
 * @param {String} text - The YAML text to decode
 * @return {Object|Array} the decoded object or array
 * @example
 * decode("message: Hello World")
 */
const decode = text => yaml.load(text);

/**
 * An object containing the YAML `encode` and `decode` functions
 */
export const yamlCodec = { encode, decode };

export default yamlCodec
