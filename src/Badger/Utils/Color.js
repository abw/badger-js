import { isObject } from "./Misc.js";

const ANSIStart  = '\u001B[';
const ANSIEnd    = 'm';
const ANSIColors = {
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

/**
 * Returns an ANSI escape code for a color string.  This can be a single color
 * name, e.g. `red`, `green`, etc., or a color prefixed with `bright` or `dark`,
 * e.g. `bright red`, `dark green`, etc.  An optional section argument can be
 * set to `fg` (default) to set a foreground color or `bg` for a background color.
 * @param {String} color - color name with optional modifier prefix
 * @param {String} [base='fg'] - `fg` or `bg` to set foreground or background color respectively
 * @return {String} ANSI escape code string
 * @example
 * const str = escapeCode('red')
 * @example
 * const str = escapeCode('bright red')
 * @example
 * const str = escapeCode('bright red', 'bg')
 */
export const ANSIescapeCode = (color, base='fg') => {
  let   codes = [ ];
  let   pair  = color.split(/ /, 2);
  const hue   = pair.pop();
  const code  = (base ? ANSIColors[base] : 0) + ANSIColors[hue];
  codes.push(code);
  if (pair.length) {
    const shade = pair.length ? pair.shift() : 'dark';
    codes.push(ANSIColors[shade])
  }
  // console.log('escapeCode(%s, %s) => ', color, base, codes.join(';'));
  return ANSIStart + codes.join(';') + ANSIEnd;
}

/**
 * Returns an ANSI escape code for a color string or combination of foreground and
 * background colors.
 * @param {String|Object} colors - either a simple color name or object contain foreground and background colors
 * @param {String} [colors.fg] - foreground color
 * @param {String} [colors.fg] - background color
 * @return {String} ANSI escape code string
 * @example
 * const str = escape('red')
 * @example
 * const str = escape('bright red')
 * @example
 * const str = escape({ fg: 'bright yellow', bg: 'blue' })
 */
export const ANSIescape = (colors={}) => {
  const col = isObject(colors) ? colors : { fg: colors };
  let escapes = [ ];
  if (col.bg) {
    escapes.push(ANSIescapeCode(col.bg, 'bg'));
  }
  if (col.fg) {
    escapes.push(ANSIescapeCode(col.fg, 'fg'));
  }
  return escapes.join('');
}

/**
 * Returns an ANSI escape code to reset all colors.
 * @return {String} ANSI escape reset string
 */
export const ANSIreset = () => ANSIescapeCode('reset', false)

/**
 * Returns a function to display strings in a particular color.
 * @param {String} color - color(s) to display string
 * @return {Function} function to display strings in the pre-defined color(s)
 */
export const color = (colors) =>
  text => ANSIescape(colors) + text + ANSIreset();