import { dir } from "./Filesystem/Directory.js";
import { requiredParam } from "./Utils/Params.js";
import { fail, hasValue } from "./Utils/Misc.js";
import { addDebug } from "./Utils/Debug.js";
import { Config } from "./Config.js";
import { Library } from "./Library.js";

const defaults = {
  library: {
  },
  config: {
    dir: 'config',
  }
}
export class Workspace {
  constructor(props={}) {
    const rootDir = dir(requiredParam(props, 'dir'));
    const cfgDir  = rootDir.dir(props.config?.dir || defaults.config.dir);
    const cfgOpts = { ...defaults.config, ...(props.config||{}), dir: cfgDir };
    const config  = new Config(cfgOpts);
    const libOpts = { ...defaults.library, ...(props.library||{}), root: rootDir };
    const library = new Library(libOpts);

    this.state = {
      rootDir,
      config,
      library
    }

    addDebug(this, props.debug, props.debugPrefix, props.debugColor);
    this.debug('root dir: ', rootDir.path());
    this.debug('config dir: ', cfgDir.path());
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

export const workspace = props => new Workspace(props);

export default Workspace;