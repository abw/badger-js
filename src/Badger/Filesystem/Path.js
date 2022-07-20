import path from 'node:path';
import { stat } from 'node:fs/promises'
import { rethrow } from '../Utils/Misc.js';
import { addDebug } from '../Utils/Debug.js';

const defaultOptions = {
  encoding: 'utf8'
}

/**
 * The Path class implements a base class for the {@link File} and {@link Directory}
 * classes.  It implements the common functionality for representing a filesystem path.
 */
export class Path {
  /**
   * Constructor for filesystem paths.
   * @param {string} path - file path
   * @param {Object} [options] - configuration options
   * @param {String} [options.codec] - codec for encoding/decoding file data
   * @return {Object} the {@link Path} object
   */
  constructor(path, options={}) {
    // allow path/file/directory to be constructed from an existing object
    if (path instanceof Path) {
      path = path.path();
    }
    this.state = { path, options: { ...defaultOptions, ...options } };
    addDebug(this, options.debug, options.debugPrefix || 'Path', options.debugColor);
  }

  /**
   * Accessor method to return the filesystem path.
   * @return {String} the filesystem path
   */
  path() {
    return this.state.path;
  }

  /**
   * Create a path relative to the current path.
   * @param {String[]} parts - part(s) of the filesystem path
   * @return {String} the new path
   * @example
   * const p = new Path('/path/to/here')
   * const q = p.relativePath('there')          // -> /path/to/here/there
   * const r = p.relativePath('and', 'there')   // -> /path/to/here/and/there
   */
  relativePath(...parts) {
    return path.join(this.state.path, ...parts);
  }

  /**
   * Internal method to merge any options with the pre-defined options passed to the
   * constructor.  Options passed as arguments will take precedence.
   * @param {Object} options - new options
   * @return {Object} the merged options
   * @example
   * const p = new Path('/path/to/here', { option1: 'hello' })
   * const q = p.options({ option2: 'world' })  // -> { option1: 'hello', options2: 'world' }
   */
  options(options={}) {
    return { ...this.state.options, ...options };
  }

  /**
   * Method to assert that the path exists.
   * @return {Promise} fulfills with `true` if the path exists or rejects if the path doesn't
   * @example
   * const p = new Path('/path/to/here')
   * p.exists()
   *   .then( console.log('path exists') )
   *   .catch( console.log('path does not exist') )
   */
  async exists() {
    try {
      await this.stat();
      return true;
    }
    catch (error) {
      return error.code === 'ENOENT'
        ? false
        : rethrow(error);
    }
  }

  /**
   * Method to fetch stats for the path.  Uses the `stat` function from `node:fs/promises`.
   * Stats are cached internally (subject to change)
   * @return {Promise} fulfills with path stats returned from the `stat` function
   * @example
   * const p = new Path('/path/to/here')
   * p.stat()
   *   .then( stats => console.log('path stats:', stats) )
   *   .catch( console.log('path does not exist') )
   */
  async stat() {
    const stats = await stat(this.state.path);
    return this.state.stats = stats;
  }

  /**
   * Method to clear internal cache of path stats (subject to change)
   */
  unstat() {
    this.state.stats = undefined;
    return this;
  }
}

export default Path
