import { DirPath } from "./Filesystem/DirPath.js";
import { addDebug } from "./Utils/Debug.js";
import { splitList } from "./Utils/Text.js";
import { fail } from "./Utils/Misc.js";

const defaults = {
  jsExt: 'js mjs',
}

/**
 * The Library class implements an object which can load Javascript files
 * from one or more library directories.  Files can be Javascript files
 * (with `.js` or `.mjs` extensions by default)
 */
export class Library extends DirPath {
  /**
   * Constructor for Library object.
   * @param {String} dir - one or more directories that contain Javascript libraries
   * @param {Object} [options] - configuration options
   * @param {Array|String} [options.jsExt='js mjs'] - Array or comma/whitespace delimited string of Javascript file extensions
   * @return {Object} the Library object
   */
  constructor(dir, options={}) {
    super(dir);
    const params = { ...defaults, ...options };
    const exts = splitList(params.jsExt).map( ext => ext.replace(/^\./, '') ); // remove leading '.'
    this.state.exts = exts;
    addDebug(this, options.debug, options.debugPrefix, options.debugColor);
    this.debug("state: ", this.state)
  }

  /**
   * Method to load a Javascript library in one of the library directories and with one of the `jsExt` extensions (`.js` or `.mjs` by default).
   * Returns the exports from the library if found or throws an error if not.
   * @param {String} uri - base part of filename
   * @return {Object} the exports from the loaded libary
   */
  async lib(uri) {
    const dirs = await this.dirs();
    const exts = this.state.exts;
    for (let dir of dirs) {
      for (let ext of exts) {
        const file = dir.file(uri + '.' + ext);
        this.debug('looking for module %s as', uri, file.path());
        const exists = await file.exists();
        if (exists) {
          const load = await import(file.path());
          this.debug('loaded %s as', file.path());
          return load;
        }
      }
    }
    fail("Library not found: ", uri);
  }
}

/**
 * Function to create a new Library object
 * @param {String} dir - directory or directories containing configuration files
 * @param {Object} [options] - configuration options
 * @param {Array|String} [options.jsExt='js mjs'] - Array or comma/whitespace delimited string of Javascript file extensions
 * @return {Object} the Library object
 */
export const library = (dir, options) => new Library(dir, options);

export default library;