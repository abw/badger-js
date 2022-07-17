import { isObject } from "./Misc.js";

export const ANSIStart  = '\u001B[';
export const ANSIEnd    = 'm';
export const ANSIColors = {
  reset:    0,
  bold:     1,
  bright:   1,
  dark:     2,
  black:    0,
  red:      1,
  green:    2,
  yellow:   3,
  blue:     4,
  magenta:  5,
  cyan:     6,
  grey:     7,
  white:    8,
  fg:      30,
  bg:      40,
};

export const escapeCode = (str, base=0) => {
  let   codes = [ ];
  let   pair  = str.split(/ /, 2);
  const hue   = pair.pop();
  const code  = (base ? ANSIColors[base] : 0) + ANSIColors[hue];
  codes.push(code);
  if (pair.length) {
    const shade = pair.length ? pair.shift() : 'dark';
    codes.push(ANSIColors[shade])
  }
  console.log('%s => %s', str, codes.join(';'));

  return ANSIStart + codes.join(';') + ANSIEnd;
}

export const escape = (c={}) => {
  // color c can be specified as a string (e.g. 'red') which is shorthand
  // for an object containing 'fg' (e.g. { fg: 'red' }) and/or 'bg' for
  // foreground and background colors respectively
  const col = isObject(c) ? c : { fg: c };
  let escapes = [ ];
  if (col.bg) {
    escapes.push(escapeCode(col.bg, 'bg'));
  }
  if (col.fg) {
    escapes.push(escapeCode(col.fg, 'fg'));
  }
  return escapes.join('');
}

export const reset = () => escapeCode('reset')

