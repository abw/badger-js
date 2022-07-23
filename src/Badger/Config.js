import { DirPath } from './Filesystem/DirPath.js';
import { splitList } from './Utils/Text.js'
import { doNothing, fail } from './Utils/Misc.js';
import { addDebug } from './Utils/Debug.js';

const defaults = {
  codecs: ['yaml', 'json'],
  jsExt:  ['js', 'mjs'],
};

/**
 * The Config class implements an object which can load configuration
 * files from a configuration directory.  Files can be Javascript files
 * (with `.js` or `.mjs` extensions by default) or data files using any
 * of the standard codecs (`.yaml` or `.json` by default).
 */
export class Config extends DirPath {
  /**
   * Constructor for Config object.
   * @param {String} dir - one or more directories that contain configuration files
   * @param {Object} [options] - configuration options
   * @param {Array|String} [options.jsExt='js mjs'] - Array or comma/whitespace delimited string of Javascript file extensions
   * @param {Array|String} [options.codecs='yaml json'] - Array or comma/whitespace delimited string of codec names
   * @return {Object} the Config object
   */
  constructor(dir, options={}) {
    super(dir);
    const params = { ...defaults, ...options };
    this.state.codecs = splitList(params.codecs),
    this.state.jsExt = splitList(params.jsExt),
    addDebug(this, options.debug, options.debugPrefix, options.debugColor);
  }

  /**
   * Internal method to locate the first config file with one of a number of file extensions.
   * @param {String} uri - base part of filename
   * @param {Array} [exts] - array of possible extensions
   * @param {Function} [makeOptions] - optional function to generate options for a {@link File} object
   * @return {Object} the {@link File} object if it exists or `undefined` if not
   */
  async firstFileWithExt(uri, exts, makeOptions=doNothing) {
    const dirs = await this.dirs();

    for (let dir of dirs) {
      for (let ext of exts) {
        const path = uri + '.' + ext;
        const file = dir.file(path, makeOptions(uri, ext));
        this.debug('looking for config file: ', file.path());
        if (await file.exists()) {
          this.debug('config file exists: ', file.path());
          return file;
        }
      }
    }
    return undefined;
  }

  /**
   * Internal method to locate a Javascript configuration file with one of the `jsExt` extensions (`.js` or `.mjs` by default)
   * @param {String} uri - base part of filename
   * @return {Object} the {@link File} object if it exists or `undefined` if not
   */
  async jsFile(uri) {
    return await this.firstFileWithExt(uri, this.state.jsExt);
  }

  /**
   * Internal method to locate a configuration file with one of the `codecs` extensions (`.yaml` or `.json` by default)
   * @param {String} uri - base part of filename
   * @return {Object} the {@link File} object if it exists or `undefined` if not
   */
  async file(uri) {
    return await this.firstFileWithExt(uri, this.state.codecs, (uri, codec) => ({ codec }));
  }

  /**
   * Method to fetch configuration data from a file.  The file can be a Javascript file which should
   * return the configuration data as the default export, or a YAML (`.yaml`) or JSON (`.json`) file.
   * If the file isn't found then the method returns the `defaults` data if provided, or throws an
   * error if not.
   * @param {String} uri - base part of filename
   * @param {Object} [defaults] - default configuration options to be used if a file isn't found
   * @return {Object} the configuration data loaded from the file
   */
  async config(uri, defaults) {
    // first look for a JS file, e.g. <uri>.js, <uri>.mjs
    const jsFile = await this.jsFile(uri);
    if (jsFile) {
      return await import(jsFile.path());
    }
    // then for a config file with a codec extension, e.g. <uri>.yaml, <uri>.yaml
    const file = await this.file(uri);
    if (file) {
      return await file.read();
    }
    return defaults || fail("No configuration file for " + uri);
  }
}

/**
 * Function to create a new Config object
 * @param {String} dir - directory or directories containing configuration files
 * @param {Object} [options] - configuration options
 * @param {Array|String} [options.jsExt='js mjs'] - Array or comma/whitespace delimited string of Javascript file extensions
 * @param {Array|String} [options.codecs='yaml json'] - Array or comma/whitespace delimited string of codec names
 * @return {Object} the Config object
 */
export const config = (dir, options) => new Config(dir, options)

export default Config
