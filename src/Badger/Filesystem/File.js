import path from 'path'
import Path from './Path.js'
import { dir } from './Directory.js'
import { codec } from '../Codecs/index.js'
import { readFile, writeFile } from 'fs/promises'

class File extends Path {
  directory(options) {
    return dir(path.dirname(this.state.path), options);
  }
  dir(...args) {
    return this.directory(...args);
  }
  read(options) {
    const opts = this.options(options);
    const file = readFile(this.state.path, opts);
    return opts.codec
      ? file.then(text => codec(opts.codec).decode(text))
      : file;
  }
  write(data, options) {
    const opts = this.options(options);
    const text = opts.codec
      ? codec(opts.codec).encode(data)
      : data;
    return writeFile(this.state.path, text, opts).then( () => this );
  }
}

//---------------------------------------------------------------------
// Utility function to create a file object from a path and optional
// options.
//---------------------------------------------------------------------
export const file = (path, options) => {
  return new File(path, options);
}

export default File
