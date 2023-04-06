import { fail, isArray, noValue } from "@abw/badger-utils";

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
  const regex = /^"((?:\\[\\"bfnrtv]|.)*?)"$/
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
  const regex = /^'((?:\\[\\'bfnrtv]|.)*?)'$/
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
  let parts = [ ];
  let part;
  let match;

  while (path.length) {
    let maybe;
    let optional;

    // match and ignore any slashes
    if ((match = path.match(/^(\/+)/))) {
      path = path.slice(match[1].length)
      continue
    }

    // look for leading ?
    if (path.match(/^(\?)/)) {
      path = path.slice(1)
      maybe = true;
    }

    if ((match = path.match(/^('((\\[\\'bfnrtv]|.)*?)')/))) {
      // matched a single quoted string
      path = path.slice(match[1].length)
      part = match[2].replace(/\\([\\'bfnrtv])/g, (all, one) => quotedEscapes[one] || `\\${one}`);
    }
    else if ((match = path.match(/^("((\\[\\"bfnrtv]|.)*?)")/))) {
      // matched a double quoted string
      path = path.slice(match[1].length)
      part = match[2].replace(/\\([\\"bfnrtv])/g, (all, one) => quotedEscapes[one] || `\\${one}`);
    }
    else if ((match = path.match(/^([^/?]+)/))) {
      // matched an unquoted string
      part = match[1]
      path = path.slice(part.length)
    }
    else {
      fail(`Can't parse data path: ${path}`);
    }

    if (path.match(/^(\?)/)) {
      path = path.slice(1)
      optional = true;
    }

    if (maybe) {
      parts.push([part, { maybe: true }])
    }
    else if (optional) {
      parts.push([part, { optional: true }])
    }
    else {
      parts.push(part)
    }
  }
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
    const next = root[word]
    // root = root[word];
    done.push(word);
    if (noValue(next)) {
      if (opts.maybe) {
        return root;
      }
      if (opts.optional) {
        return undefined;
      }
      fail("No value for data at path: ", done.join('/'));
    }
    root = next
  }
  return root;
}
