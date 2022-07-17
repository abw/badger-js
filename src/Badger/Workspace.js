import { dir } from "./Filesystem/Directory.js";
import { requiredParam } from "./Utils/Params.js";
import { hasValue } from "./Utils/Misc.js";
import { addDebug } from "./Utils/Debug.js";
import { config } from "./Config.js";

const defaults = {
  config: {
    dir: 'config',
  }
}
export class Workspace {
  constructor(props={}) {
    const rootDir = dir(requiredParam(props, 'dir'));
    const cfgDir  = rootDir.dir(props.config?.dir || defaults.config.dir);
    const cfgOpts = { ...defaults.config, ...(props.config||{}), dir: cfgDir };
    const cfgObj  = config(cfgOpts);

    this.state = {
      rootDir:   rootDir,
      configDir: cfgDir,
      config:    cfgObj
    }

    addDebug(this, props.debug, props.debugPrefix, props.debugColor);
    this.debug('root dir: ', rootDir.path());
    this.debug('config dir: ', cfgDir.path());
  }
  dir(path, options) {
    this.debug("dir(%s, %o)", path, options);
    return hasValue(path)
      ? this.state.rootDir(path, options)
      : this.state.rootDir;
  }
  configDir(path, options) {
    this.debug("configDir(%s, %o)", path, options);
    return hasValue(path)
      ? this.state.configDir(path, options)
      : this.state.configDir;
  }
  config(uri, defaults) {
    this.debug("config(%s, %o)", uri, defaults);
    return hasValue(uri)
      ? this.state.config.config(uri, defaults)
      : this.state.config;
  }
}

export const workspace = props => new Workspace(props);

export default workspace;