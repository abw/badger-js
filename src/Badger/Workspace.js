import { dir as fsDir } from "./Filesystem/Directory.js";
import { fail, hasValue } from "./Utils/Misc.js";
import { addDebug } from "./Utils/Debug.js";
import { Config } from "./Config.js";
import { Library } from "./Library.js";
import { splitList } from "../Badger.js";

const defaults = {
  library: {
    dir: 'lib library src components',
  },
  config: {
    dir: 'config',
  }
}
export class Workspace {
  constructor(dir, options={}) {
    const rootDir = fsDir(dir);
    const cfgDir  = rootDir.dir(options.config?.dir || defaults.config.dir);
    const cfgOpts = { ...defaults.config, ...(options.config||{}) };
    const config  = new Config(cfgDir, cfgOpts);
    const libDirs = splitList(options.library?.dir || defaults.library.dir).map( dir => rootDir.dir(dir) );
    const libOpts = { ...defaults.library, ...(options.library||{}) };
    const library = new Library(libDirs, libOpts);

    this.state = {
      rootDir,
      config,
      library
    }

    // console.log('options: ', options);
    addDebug(this, options.debug, options.debugPrefix, options.debugColor);
    this.debug('root dir: ', rootDir.path());
    this.debug('config dir: ', cfgDir.path());
    this.debug('libDirs: ', libDirs);
    this.debug('libOpts: ', libOpts);
  }
  dir(path, options) {
    this.debug("dir(%s, %o)", path, options);
    return hasValue(path)
      ? this.state.rootDir.dir(path, options)
      : this.state.rootDir;
  }
  file(path, options) {
    this.debug("file(%s, %o)", path, options);
    return this.state.rootDir.file(path, options)
  }
  read(path, options) {
    this.debug("read(%s, %o)", path, options);
    return this.file(path, options).read();
  }
  write(path, data, options) {
    this.debug("write(%s, %o, %o)", path, data, options);
    return this.file(path, options).write(data);
  }
  configDir(path, options) {
    this.debug("configDir(%s, %o)", path, options);
    return hasValue(path)
      ? this.state.configDir(path, options)
      : this.state.configDir;
  }
  async config(uri, defaults) {
    this.debug("config(%s, %o)", uri, defaults);
    return hasValue(uri)
      ? this.state.config.config(uri, defaults)
      : this.state.config;
  }
  async lib(uri) {
    return this.state.library.lib(uri);
  }
  async component(uri, props) {
    const config  = await this.config(uri, {});
    const lib     = await this.lib(config.component?.library || uri);
    const exp     = config.component?.export || 'default';
    const compcls = lib[exp] || fail("No '", exp, "' export from component library: ", uri);
    const comp = new compcls(this, { ...config, ...props });
    // this.debug("created component ", uri)
    return comp;
  }
}

export const workspace = (dir, options) => new Workspace(dir, options);

export default Workspace;