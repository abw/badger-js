import path from 'path';
import Path from './Path.js'
import { file } from './File.js'
import { fail } from '../Utils/Misc.js';
import { rm, mkdir, rmdir, readdir } from 'fs/promises'

class Directory extends Path {
  /**
   * Fetch a new {@link File} object for a file in the directory.
   * @param {string} path - file path
   * @param {Object} [options] - file configuration options
   * @param {String} [options.codec] - codec for encoding/decoding file data
   * @return {Object} the {@link File} object
   */
  file(path, options) {
    this.debug("file(%s, %o)", path, options);
    return file(this.relativePath(path), this.options(options));
  }

  /**
   * Fetch a new {@link Directory} object for a sub-directory in the directory.
   * @param {string} path - directory path
   * @param {Object} [options] - directory configuration options
   * @param {String} [options.codec] - codec for encoding/decoding file data
   * @return {Object} the {@link Directory} object
   */
  directory(path, options) {
    this.debug("directory(%s, %o)", path, options);
    return dir(this.relativePath(path), this.options(options));
  }

  /**
   * An alias for the {@link directory} method for lazy people
   * @return {Object} the {@link Directory} object
   */
  dir(path, options) {
    this.debug("dir(%s, %o)", path, options);
    return this.directory(path, options);
  }

  /**
   * Returns a new {@link Directory} object for the parent directory
   * @param {Object} [options] - directory configuration options
   * @param {Boolean} [options.codec] - codec for encoding/decoding file data
   * @return {Object} a {@link Directory} object for the parent
   */
  parent(options) {
    this.debug("parent()");
    return this.directory('..', options);
  }

  /**
   * Returns the names of the files and sub-directories in the directory
   * @return {Promise} fulfills with an array of the file and directory names
   */
  read() {
    this.debug("read()");
    return readdir(this.path());
  }

  /**
   * Determines if the directory is empty.
   * @return {Promise} fulfills with a boolean value true (empty) or false (not empty).
   */
  isEmpty() {
    this.debug("isEmpty()");
    return this.read().then(
      entries => entries.length === 0
    );
  }

  /**
   * Determines if the directory is not empty.
   * @return {Promise} fulfills with a boolean value true (not empty) or false (empty).
   */
  notEmpty() {
    this.debug("notEmpty()");
    return this.isEmpty().then(
      empty => ! empty
    );
  }

  /**
   * Empty the directory.
   * @param {Object} [options] - configuration options
   * @param {Boolean} [options.force] - force removal of files and directories
   * @param {Boolean} [options.recursive] - recursively empty and delete sub-directories
   * @return {Promise} fulfills to the {@link Directory} object
   */
  empty(options={}) {
    this.debug("empty(%o)", options);
    return this.exists()
      .then( exists  => exists && this.isEmpty() )
      .then( isEmpty => isEmpty || rm(this.path(), options) )
      .then( () => this );
  }

  /**
   * Make the directory.
   * @param {Object} [options] - configuration options
   * @param {Boolean} [options.recursive] - create intermediate directories
   * @return {Promise} fulfills to the {@link Directory} object
   */
  mkdir(options={}) {
    this.debug("mkdir(%o)", options);
    return this.exists()
      .then( exists => exists || mkdir(this.path(), options) )
      .then( () => this );
  }

  /**
   * Remove the directory.
   * @param {Object} [options] - configuration options
   * @param {Boolean} [options.empty] - delete items in directory
   * @param {Boolean} [options.force] - force delete files and directories
   * @param {Boolean} [options.recursive] - recursively delete sub-directories
   * @return {Promise} fulfills to the {@link Directory} object
   */
  rmdir(options={}) {
    this.debug("rmdir(%o)", options);
    return (options.empty ? this.empty(options) : Promise.resolve(true))
        .then( () => this.exists() )
        .then( exists => exists && rmdir(this.path()) )
        .then( () => this );
  }

  /**
   * Create the directory and any intermediate directories.
   * @param {Object} [options] - configuration options
   * @param {Boolean} [options.recursive=true] - recursively create intermediate directories
   * @return {Promise} fulfills to the {@link Directory} object
   */
  create(options={ recursive: true }) {
    this.debug("create(%o)", options);
    return this.mkdir(options);
  }

  /**
   * Empty and delete the directory.
   * @param {Object} [options] - configuration options
   * @param {Boolean} [options.empty=true] - empty directory of any files and sub-directories
   * @param {Boolean} [options.recursive=true] - recursively delete sub-directories
   * @param {Boolean} [options.force=true] - force deletion of files and sub-directories
   * @return {Promise} fulfills to the {@link Directory} object
   */
  destroy(options={ empty: true, recursive: true, force: true }) {
    this.debug("destroy(%o)", options);
    return this.rmdir(options);
  }

  /**
   * Assert that a directory exists and optionally create it
   * @param {Object} [options] - configuration options
   * @param {Boolean} [options.create] - create the directory and any intermediate directories if it doesn't exist - equivalent to adding `mkdir` and `recursive` options or calling {@link create}
   * @param {Boolean} [options.mkdir] - create the directory, add the `recursive` option to create intermediate directories - equivalent to calling {@link mkdir}
   * @param {Boolean} [options.recursive] - when used with `mkdir`, creates any intermediate directories
   * @return {Promise} fulfills to the {@link Directory} object
   */
  mustExist(options={}) {
    this.debug("mustExist(%o)", options);
    return this.exists()
      .then(
        exists =>
          exists         ? this :
          options.mkdir  ? this.mkdir(options) :
          options.create ? this.create() :
          fail("Directory does not exist: ", this.path())
      )
  }
}

/**
 * Function to create a new {@link Directory} object
 * @param {string} path - directory path
 * @param {Object} [options] - configuration options
 * @param {Boolean} [options.codec] - a codec for encoding/decoding files
 * @return {Object} the {@link Directory} object
 */
export const dir = (path, options) => {
  return new Directory(path, options);
}

/**
 * Function to create a new {@link Directory} object for the current working directory
 * @param {Object} [options] - configuration options
 * @param {Boolean} [options.codec] - a codec for encoding/decoding files
 * @return {Object} the {@link Directory} object
 */
export const cwd = options => {
  return dir(process.cwd(), options);
}

/**
 * Function to create a new {@link Directory} object for the directory of a JS source file
 * @param {string} url - module url - from `import.meta.url`
 * @param {Object} [options] - configuration options
 * @param {Boolean} [options.codec] - a codec for encoding/decoding files
 * @return {Object} the {@link Directory} object
 */
export const bin = (url, options) => {
  return dir(
    path.dirname(url.replace(/^file:\/\//, '')),
    options
  );
}

export default Directory
