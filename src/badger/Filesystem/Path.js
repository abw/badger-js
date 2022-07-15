import fs from 'fs-extra'
import path from 'path';

const defaultOptions = {
  encoding: 'utf8'
}

export class Path {
  constructor(path, options={}) {
    this.state = { path, options: { ...defaultOptions, ...options } };
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
  exists() {
    return fs.existsSync(this.state.path);
  }
  stats() {
    if (! this.state.stats) {
      this.state.stats = fs.statSync(this.state.path);
    }
    return this.state.stats
  }
}

export default Path
