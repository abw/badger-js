import { ANSIescape, ANSIreset } from './Color.js'
import { doNothing } from '@abw/badger-utils';

/**
 * Returns a debugging function which is enabled by the first `enabled` argument.
 * If this is `false` then it returns a function which does nothing.  If it is
 * true then it returns a function that forwards all arguments to `console.log`.
 * An optional `prefix` be be specified to prefix each debugging line.  The
 * optional third argument `color` can be used to specify a color for the prefix.
 * @param {Boolean} enabled - is debugging enabled?
 * @param {String} [prefix] - optional prefix for debugging messages
 * @param {String|Object} [color] - a color name or object (see {@link Badger/Utils/Color})
 * @param {String} [color.fg] - foreground color
 * @param {String} [color.bg] - background color
 * @return {Function} a debugging function
 * @example
 * const debug = Debugger(true)
 * @example
 * const debug = Debugger(true, 'Debug > ')
 * @example
 * const debug = Debugger(true, 'Debug > ', 'blue')
 * @example
 * const debug = Debugger(true, 'Debug > ', { bg: 'blue', fg: 'bright yellow' })
 */
export function Debugger(enabled, prefix='', color) {
  return enabled
    ? prefix
      ? (format, ...args) =>
        console.log(
          '%s' + prefix + '%s' + format,
          color ? ANSIescape(color) : '',
          ANSIreset(),
          ...args,
        )
      : console.log.bind(console)
    : doNothing;
}

/**
 * Creates a debugging function via {@link Debugger} and attaches it to the object
 * passed as the first argument as the `debug` function.
 * @param {Object} obj - the object to receive the `debug` function
 * @param {Boolean} enabled - is debugging enabled?
 * @param {String} [prefix] - optional prefix for debugging messages
 * @param {String|Object} [color] - a color name or object (see {@link Badger/Utils/Color})
 * @param {String} [color.fg] - foreground color
 * @param {String} [color.bg] - background color
 * @example
 * const debug = addDebug(myObject, true)
 * @example
 * const debug = addDebug(myObject, true, 'Debug > ')
 * @example
 * const debug = addDebug(myObject, true, 'Debug > ', 'blue')
 * @example
 * const debug = addDebug(myObject, true, 'Debug > ', { bg: 'blue', fg: 'bright yellow' })
 */
export function addDebug(obj, enabled, prefix='', color) {
  obj.debug = Debugger(enabled, prefix, color);
}
