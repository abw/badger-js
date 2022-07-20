import { dir as fsdir } from "./Filesystem/Directory.js";
import { requiredParam } from "./Utils/Params.js";
import { addDebug } from "./Utils/Debug.js";
import { splitList } from "./Utils/Text.js";
import { fail } from "../Badger.js";

const defaults = {
  dir: ['lib','library','src','components'],
  ext: ['js', 'mjs'],
}

export class Library {
  constructor(props={}) {
    const root = fsdir(requiredParam(props, 'root'));
    const dir  = props.directory || props.dir || props.dirs || defaults.dir;
    const ext  = props.extension || props.ext || props.exts || defaults.ext;
    const dirs = splitList(dir).map( dir => root.dir(dir) );  // resolve to root dir
    const exts = splitList(ext).map( ext => ext.replace(/^\./, '') ); // remove leading '.'
    this.state = {
      dirs, exts
    }
    addDebug(this, props.debug, props.debugPrefix, props.debugColor);
  }
  async dirs() {
    return this.state.dirsExist
      || ( this.state.dirsExist = await this.dirsExist() );
  }
  async dirsExist() {
    const dirs = this.state.dirs;
    const exists = await Promise.all(
      dirs.map( d => d.exists() )
    );
    return dirs.filter((value, index) => exists[index]);
  }
  async lib(uri) {
    const dirs = await this.dirs();
    const exts = this.state.exts;
    for (let dir of dirs) {
      for (let ext of exts) {
        const file = dir.file(uri + '.' + ext);
        this.debug('looking for module %s as', uri, file.path());
        const exists = await file.exists();
        if (exists) {
          const load   = await import(file.path());
          this.debug('loaded %s as', file.path());
          return load;
        }
      }
    }
    fail("Library not found: ", uri);
  }
}

export const library = props => new Library(props);

export default library;