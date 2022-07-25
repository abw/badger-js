import { fail, hasValue, isArray, noValue } from "./Misc.js";

/**
 * Characters that can be escaped in quoted strings.
 */
const quotedEscapes = {
  b: "\b",
  f: "\f",
  n: "\n",
  r: "\r",
  t: "\t",
  v: "\v",
  '"': '"',
  "'": "'",
  '\\': '\\',
}

/**
 * Match a double quoted string and expand escaped characters
 * @param {String} [string] - the string to match
 */
export const matchDoubleQuotedString = string => {
  const regex = /^"((?:\\[\\"nrt]|.)*?)"$/
  const match = string.match(regex);
  return match
    ? match[1].replace(/\\([\\"bfnrtv])/g, (all, one) => quotedEscapes[one] || `\\${one}`)
    : null;
}

/**
 * Match a single quoted string and expand escaped characters
 * @param {String} [string] - the string to match
 */
export const matchSingleQuotedString = string => {
  const regex = /^'((?:\\[\\']|.)*?)'$/
  const match = string.match(regex);
  return match
    ? match[1].replace(/\\([\\'bfnrtv])/g, (all, one) => quotedEscapes[one] || `\\${one}`)
    : null;
}

/**
 * Split a data path into component parts
 * @param {String} [path] - the path to split
 */
export const splitDataPath = path => {
  // * match a slash: \/
  // * match a single quoted string: '...'
  // * match a double quoted string: "..."
  // * match anything else: hello world!
  let parts = [ ];
  const regex = /(?:(\/)|'((?:\\[\\']|.)*?)'|"((?:\\[\\"nrt]|.)*?)"|([^/?]+))(\??)/g;
  const matches = [...path.matchAll(regex)];

  matches.map(
    ([ , , single, double, other, optional]) => {
      let part;
      // console.log('match [slash:%s] [single:%s] [double:%s] [other:%s]', slash, single, double, other);

      if (single) {
        part = single.replace(/\\([\\'bfnrtv])/g, (all, one) => quotedEscapes[one] || `\\${one}`);
      }
      else if (double) {
        part = double.replace(/\\([\\"bfnrtv])/g, (all, one) => quotedEscapes[one] || `\\${one}`);
      }
      else if (other) {
        part = other
      }
      if (hasValue(part)) {
        parts.push(optional ? [part, {optional:true}] : part);
      }
    }
  )
  // console.log('MATCHED ', parts);

  return parts;
}

/**
 * Traverse a data structure using a path.
 * @param {Object} [data] - the data to traverse
 * @param {String} [path] - the data path
 */
export const dataPath = (data, path) => {
  let root  = data;
  let parts = splitDataPath(path);
  let done  = [ ];
  // console.log('parts: ', parts);

  for (let part of parts) {
    const [word, opts] = isArray(part) ? part : [part, {}];
    root = root[word];
    done.push(word);
    if (noValue(root)) {
      if (opts.optional) {
        return root;
      }
      else {
        fail("No value for data at path: ", done.join('/'));
      }
    }
  }
  return root;
}
