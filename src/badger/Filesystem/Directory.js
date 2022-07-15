import path from 'path';
import Path from './Path.js'
import { file } from './File.js'

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
}

//---------------------------------------------------------------------
// Utility functions to create a directory object from a path (dir), to
// represent the current working directory (cwd) or the path from a
// source module (moduleDir).  All can take optional options.
//---------------------------------------------------------------------
export const dir = (path, options) => {
  return new Directory(path, options);
}

export const cwd = options => {
  return dir(process.cwd(), options);
}

export const bin = (url, opts) => {
  return dir(
    path.dirname(url.replace(/^file:\/\//, '')),
    opts
  );
}

export default Directory
