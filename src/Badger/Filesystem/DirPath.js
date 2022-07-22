import { dir as fsDir } from "./Directory.js";
import { splitList } from "../Utils/Text.js";

/**
 * The DirPath class implements a base class for objects that
 * can search one or more directories.
 */
export class DirPath {
  /**
   * Constructor for filesystem paths.
   * @param {String|Array} dir - comma/whitespace delimited string containing directories, or a {@link Directory} object or Array of {@link Directory} objects
   * @return {Object} the {@link DirPath} object
   */
  constructor(dir) {
    const dirs = this.initDirs(dir);
    this.state = {
      dirs
    }
  }

  /**
   * Internal method to initialise the directories.  If the `dir` argument is a string then it will be split on
   * commas and/or whitespace and converted to an array of {@link Directory} objects.  If the `dir` is a
   * {@link Directory} object then it will be wrapped in an array.  If the `dir` argument is already an array
   * (presumably of {@link Directory} objects) then no further processing is required.
   * @param {String|Array} dir - comma/whitespace delimited string containing directories, or a {@link Directory} object or Array of {@link Directory} objects
   * @return {Array} an array of {@link Directory} objects
   */
  initDirs(dir) {
    return splitList(dir).map( dir => fsDir(dir) );
  }

  /**
   * Internal method to return an array of the directories in the `dirs` argument passed to the constructor that
   * actually exist in the filesystem.  The checks to determine if the directories exists are only carried
   * out the first time the method is called.  Subsequent calls will return the cached value stored in
   * `this.state.dirsExist`.
   * @return {Array} an array of {@link Directory} objects that exist
   */
  async dirs() {
    return this.state.dirsExist
      || ( this.state.dirsExist = await this.dirsExist() );
  }

  /**
   * Internal method to determine which of the directories in the `dirs` argument passed to the constructor
   * actually exist in the filesystem.
   * @return {Array} an array of {@link Directory} objects that exist
   */
  async dirsExist() {
    const dirs = this.state.dirs;
    const exists = await Promise.all(
      dirs.map( d => d.exists() )
    );
    return dirs.filter((value, index) => exists[index]);
  }
}

export default DirPath