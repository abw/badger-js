import fs from 'fs'
import path from 'path';
import Path from './Path.js'
import { file } from './File.js'
import { fail } from '../Utils/Misc.js';

class Directory extends Path {
  file(name, options) {
    return file(this.relativePath(name), this.options(options));
  }
  directory(path, options) {
    return dir(this.relativePath(path), this.options(options));
  }
  dir(...args) {
    return this.directory(...args);
  }
  parent(options) {
    return this.directory('..', options);
  }
  read() {
    return fs.readdirSync(this.path());
  }

  /**
   * Determines if the directory is empty.
   * @return {Boolean} true (empty) or false (not empty).
   */
  isEmpty() {
    return this.read().length === 0;
  }

  /**
   * Determines if the directory is not empty.
   * @return {Boolean} true (not empty) or false (empty).
   */
  notEmpty() {
    return ! this.isEmpty();
  }

  /**
   * Empty the directory.
   * @param {Object} [options] - configuration options
   * @param {Boolean} [options.force] - force removal of files and directories
   * @param {Boolean} [options.recursive] - recursively empty and delete sub-directories
   * @return {Object} the `Directory` object
   */
  empty(options={}) {
    if (this.exists() && this.notEmpty()) {
      fs.rmSync(this.path(), options);
    }
    return this;
  }

  /**
   * Make the directory.
   * @param {Object} [options] - configuration options
   * @param {Boolean} [options.recursive] - create intermediate directories
   * @return {Object} the `Directory` object
   */
  mkdir(options={}) {
    fs.mkdirSync(this.path(), options);
    return this;
  }

  /**
   * Remove the directory.
   * @param {Object} [options] - configuration options
   * @param {Boolean} [options.empty] - delete items in directory
   * @param {Boolean} [options.force] - force delete files and directories
   * @param {Boolean} [options.recursive] - recursively delete sub-directories
   * @return {Object} the `Directory` object
   */
  rmdir(options={}) {
    if (options.empty) {
        this.empty(options);
    }
    if (this.exists()) {
      fs.rmdirSync(this.path());
    }
    return this;
  }

  /**
   * Create the directory and any intermediate directories.
   * @param {Object} [options] - configuration options
   * @param {Boolean} [options.recursive=true] - recursively create intermediate directories
   * @return {Object} the `Directory` object
   */
  create(options={ recursive: true }) {
    return this.mkdir(options);
  }

  /**
   * Empty and delete the directory.
   * @param {Object} [options] - configuration options
   * @param {Boolean} [options.empty=true] - empty directory of any files and sub-directories
   * @param {Boolean} [options.recursive=true] - recursively delete sub-directories
   * @param {Boolean} [options.force=true] - force deletion of files and sub-directories
   * @return {Object} the `Directory` object
   */
  destroy(options={ empty: true, recursive: true, force: true }) {
    return this.rmdir(options);
  }

  /**
   * Assert that a directory exists and optionally create it
   * @param {Object} [options] - configuration options
   * @param {Boolean} [options.create] - create the directory and any intermediate directories if it doesn't exist - equivalent to adding `mkdir` and `recursive` options or calling {@link create}
   * @param {Boolean} [options.mkdir] - create the directory, add the `recursive` option to create intermediate directories - equivalent to calling {@link mkdir}
   * @param {Boolean} [options.recursive] - when used with `mkdir`, creates any intermediate directories
   * @return {Object} the `Directory` object
   */
  mustExist(options={}) {
    if (this.exists()) {
      return this;
    }
    if (options.mkdir) {
      return this.mkdir(options);
    }
    if (options.create) {
      return this.create();
    }
    else {
      return fail("Directory does not exist: ", this.path());
    }
  }
}

//---------------------------------------------------------------------
// Utility functions to create a directory object from a path (dir), to
// represent the current working directory (cwd) or the path from a
// source module (moduleDir).  All can take optional options.
//---------------------------------------------------------------------
/**
 * Function to create a new `Directory` object
 * @param {String} [path] - directory path
 * @param {Object} [options] - configuration options
 * @param {Boolean} [options.codec] - a codec for encoding/decoding files
 * @return {Object} the `Directory` object
 */
export const dir = (path, options) => {
  return new Directory(path, options);
}

/**
 * Function to create a new Directory object for the current working directory
 * @param {Object} [options] - configuration options
 * @param {Boolean} [options.codec] - a codec for encoding/decoding files
 * @return {Object} the `Directory` object
 */
export const cwd = options => {
  return dir(process.cwd(), options);
}

/**
 * Function to create a new Directory object for the directory of a JS source file
 * @param {String} [url] - module url - from `import.meta.url`
 * @param {Object} [options] - configuration options
 * @param {Boolean} [options.codec] - a codec for encoding/decoding files
 * @return {Object} the `Directory` object
 */
export const bin = (url, options) => {
  return dir(
    path.dirname(url.replace(/^file:\/\//, '')),
    options
  );
}

export default Directory
