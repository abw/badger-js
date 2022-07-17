import path from 'path';
import { stat } from 'fs/promises'
import { rethrow } from '../Utils/Misc.js';
import { addDebug } from '../Utils/Debug.js';

const defaultOptions = {
  encoding: 'utf8'
}

export class Path {
  constructor(path, options={}) {
    // allow path/file/directory to be constructed from an existing object
    if (path instanceof Path) {
      path = path.path();
    }
    this.state = { path, options: { ...defaultOptions, ...options } };
    addDebug(this, options.debug, options.debugPrefix || 'Path', options.debugColor);
  }
  path() {
    return this.state.path;
  }
  relativePath(...parts) {
    return path.join(this.state.path, ...parts);
  }
  options(options={}) {
    return { ...this.state.options, ...options };
  }
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
  async stat() {
    const stats = await stat(this.state.path);
    return this.state.stats = stats;
  }
  unstat() {
    this.state.stats = undefined;
    console.log('XXX unstat: ', this.state.stats);
    return this;
  }
}

export default Path
