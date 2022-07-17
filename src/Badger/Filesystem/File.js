import path from 'path'
import Path from './Path.js'
import { dir } from './Directory.js'
import { codec } from '../Codecs/index.js'
import { readFile, writeFile } from 'fs/promises'

class File extends Path {
  /**
   * Returns a new {@link Directory} object for the parent directory of the file
   * @param {Object} [options] - directory configuration options
   * @param {Boolean} [options.codec] - codec for encoding/decoding file data
   * @return {Object} a {@link Directory} object for the parent
   */
  directory(options) {
    return dir(path.dirname(this.state.path), options);
  }

  /**
   * An alias for the {@link directory} method for lazy people
   * @return {Object} the parent {@link Directory} object
   */
  dir(...args) {
    return this.directory(...args);
  }

  /**
   * Reads the file content.  If a `codec` has been specified then the content is decoded.
   * @param {Object} [options] - directory configuration options
   * @param {Boolean} [options.codec] - codec for encoding/decoding file data
   * @return {String|Object} the file content
   * @example
   * const text = file('myfile.txt').read();
   * @example
   * const data = file('myfile.json', { codec: 'json' }).read();
   * @example
   * const data = file('myfile.json').read({ codec: 'json' });
   */
  read(options) {
    const opts = this.options(options);
    const file = readFile(this.state.path, opts);
    return opts.codec
      ? file.then(text => codec(opts.codec).decode(text))
      : file;
  }

  /**
   * Writes the file content.  If a `codec` has been specified then the content will be encoded.
   * @param {String|Object} data - directory configuration options
   * @param {Object} [options] - directory configuration options
   * @param {Boolean} [options.codec] - codec for encoding/decoding file data
   * @example
   * file('myfile.txt').write('Hello World');
   * @example
   * file('myfile.json', { codec: 'json' }).write({ message: 'Hello World' });
   * @example
   * file('myfile.json').write({ message: 'Hello World' }, { codec: 'json' });
   */
  write(data, options) {
    const opts = this.options(options);
    const text = opts.codec
      ? codec(opts.codec).encode(data)
      : data;
    return writeFile(this.state.path, text, opts).then( () => this );
  }
}

/**
 * Function to create a new {@link File} object for a file
 * @param {String} path - file path
 * @param {Object} [options] - configuration options
 * @param {Boolean} [options.codec] - a codec for encoding/decoding files
 * @return {Object} the {@link File} object
 */
export const file = (path, options) => {
  return new File(path, options);
}

export default File
