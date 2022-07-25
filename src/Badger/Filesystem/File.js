import path from 'node:path'
import Path from './Path.js'
import { dir } from './Directory.js'
import { codec } from '../Codecs/index.js'
import { readFile, writeFile, rm } from 'node:fs/promises'

/**
 * The File class implements a wrapper around a filesystem
 * file.
 */
export class File extends Path {
  /**
   * Returns a new {@link Directory} object for the parent directory of the file
   * @param {Object} [options] - directory configuration options
   * @param {String} [options.codec] - codec for encoding/decoding file data
   * @param {String} [options.encoding=utf8] - character encoding
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
   * @param {String} [options.codec] - codec for encoding/decoding file data
   * @param {String} [options.encoding=utf8] - character encoding
   * @return {Promise} fulfills with the file content
   * @example
   * file('myfile.txt').read().then( text => console.log(text) );
   * @example
   * file('myfile.json', { codec: 'json' }).read().( data => console.log(data) );
   * @example
   * file('myfile.json').read({ codec: 'json' }).then( data => console.log(data) );
   */
  async read(options) {
    const opts = this.options(options);
    const text = await readFile(this.state.path, opts);
    return opts.codec
      ? codec(opts.codec).decode(text)
      : text;
  }

  /**
   * Writes the file content.  If a `codec` has been specified then the content will be encoded.
   * @param {String|Object} data - directory configuration options
   * @param {Object} [options] - directory configuration options
   * @param {String} [options.codec] - codec for encoding/decoding file data
   * @param {String} [options.encoding=utf8] - character encoding
   * @return {Promise} fulfills with the file object
   * @example
   * file('myfile.txt').write('Hello World');
   * @example
   * file('myfile.json', { codec: 'json' }).write({ message: 'Hello World' });
   * @example
   * file('myfile.json').write({ message: 'Hello World' }, { codec: 'json' });
   */
  async write(data, options) {
    const opts = this.options(options);
    const text = opts.codec
      ? codec(opts.codec).encode(data)
      : data;
    await writeFile(this.state.path, text, opts);
    return this;
  }

  /**
   * Delete the file content.
   * @param {Object} [options] - directory configuration options
   * @param {Boolean} [options.force=false] - when true, exceptions will be ignored if path does not exist
   * @return {Promise} fulfills with the file object
   */
  async delete(options) {
    await rm(this.state.path, options);
    return this;
  }
}

/**
 * Function to create a new {@link File} object for a file
 * @param {String} path - file path
 * @param {Object} [options] - configuration options
 * @param {Boolean} [options.codec] - a codec for encoding/decoding files
 * @param {String} [options.encoding=utf8] - character encoding
 * @return {Object} the {@link File} object
 */
export const file = (path, options) => {
  return new File(path, options);
}

export default File
