import { fail, hasValue, isArray, noValue } from "./Misc.js";

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

export const matchDoubleQuotedString = string => {
  const regex = /^"((?:\\[\\"nrt]|.)*?)"$/
  const match = string.match(regex);
  return match
    ? match[1].replace(/\\([\\"bfnrtv])/g, (all, one) => quotedEscapes[one] || `\\${one}`)
    : null;
}

export const matchSingleQuotedString = string => {
  const regex = /^'((?:\\[\\']|.)*?)'$/
  const match = string.match(regex);
  return match
    ? match[1].replace(/\\([\\'bfnrtv])/g, (all, one) => quotedEscapes[one] || `\\${one}`)
    : null;
}

export const splitDataPath = path => {
  // * match a slash: \/
  // * match a single quoted string: '...'
  // * match a double quoted string: "..."
  // * match anything else: hello world!
  let parts = [ ];
  const regex = /(?:(\/)|'((?:\\[\\']|.)*?)'|"((?:\\[\\"nrt]|.)*?)"|([^/?]+))(\??)/g;
  // console.log('\nsplitDataPath [%s]', path);
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

// eslint-disable-next-line no-unused-vars
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
