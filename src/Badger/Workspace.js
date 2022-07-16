import path from 'path';
import { dir } from './Filesystem/Directory.js'

export class Workspace {
  constructor(params={}) {
    console.log('workspace constructor');
  }
  //file(name, options) {
  //  return file(this.relativePath(name), this.options(options));
  //}
  //directory(path, options) {
  //  return dir(this.relativePath(path), this.options(options));
  //}
}

export const workspace = opts => new Workspace(opts);

export default workspace;