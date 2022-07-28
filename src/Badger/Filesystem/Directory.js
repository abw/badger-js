import process from 'node:process';
import path from 'node:path';
import Path from './Path.js'
import { file } from './File.js'
import { fail } from '../Utils/Misc.js';
import { rm, mkdir, rmdir, readdir } from 'node:fs/promises'

/**
 * The Directory class implements a wrapper around a filesystem
 * directory.
 */
export class Directory extends Path {
  /**
   * Fetch a new {@link File} object for a file in the directory.
   * @param {string} path - file path
   * @param {Object} [options] - file configuration options
   * @param {String} [options.codec] - codec for encoding/decoding file data
   * @param {String} [options.encoding=utf8] - character encoding
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
   * @param {String} [options.codec] - default codec for encoding/decoding files
   * @param {String} [options.encoding=utf8] - default character encoding for files
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
   * @param {String} [options.codec] - default codec for encoding/decoding files
   * @param {String} [options.encoding=utf8] - default character encoding for files
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
  async read() {
    this.debug("read()");
    return await readdir(this.path());
  }

  /**
   * Determines if the directory is empty.
   * @return {Promise} fulfills with a boolean value true (empty) or false (not empty).
   */
  async isEmpty() {
    this.debug("isEmpty()");
    const entries = await this.read();
    return entries.length === 0;
  }

  /**
   * Determines if the directory is not empty.
   * @return {Promise} fulfills with a boolean value true (not empty) or false (empty).
   */
  async notEmpty() {
    this.debug("notEmpty()");
    const empty = await this.isEmpty();
    return !empty;
  }

  /**
   * Empty the directory.
   * @param {Object} [options] - configuration options
   * @param {Boolean} [options.force] - force removal of files and directories
   * @param {Boolean} [options.recursive] - recursively empty and delete sub-directories
   * @return {Promise} fulfills to the {@link Directory} object
   */
  async empty(options={}) {
    this.debug("empty(%o)", options);
    if (await this.exists() && await this.notEmpty()) {
      await rm(this.path(), options);
    }
    return this;
  }

  /**
   * Make the directory.
   * @param {Object} [options] - configuration options
   * @param {Boolean} [options.recursive] - create intermediate directories
   * @return {Promise} fulfills to the {@link Directory} object
   */
  async mkdir(options={}) {
    this.debug("mkdir(%o)", options);
    const exists = await this.exists();
    if (! exists) {
      await mkdir(this.path(), options);
    }
    return this;
  }

  /**
   * Remove the directory.
   * @param {Object} [options] - configuration options
   * @param {Boolean} [options.empty] - delete items in directory
   * @param {Boolean} [options.force] - force delete files and directories
   * @param {Boolean} [options.recursive] - recursively delete sub-directories
   * @return {Promise} fulfills to the {@link Directory} object
   */
  async rmdir(options={}) {
    this.debug("rmdir(%o)", options);
    if (options.empty) {
      await this.empty(options);
    }
    if (await this.exists()) {
      await rmdir(this.path());
    }
    return this;
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
  async mustExist(options={}) {
    this.debug("mustExist(%o)", options);
    if (await this.exists()) {
      return this;
    }
    if (options.mkdir) {
      return this.mkdir(options);
    }
    if (options.create) {
      return this.create();
    }
    fail("Directory does not exist: ", this.path());
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
export const bin = (url=process.argv[1], options) => {
  return dir(
    path.dirname(url.replace(/^file:\/\//, '')),
    options
  );
}

export default Directory
