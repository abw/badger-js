import { dir as fsDir } from "./Filesystem/Directory.js";
import { fail, hasValue } from "./Utils/Misc.js";
import { addDebug } from "./Utils/Debug.js";
import { splitList } from "./Utils/Text.js";
import { Config } from "./Config.js";
import { Library } from "./Library.js";

/**
 * Default configuration options.
 */
const defaults = {
  config: {
    dir: 'config',
  },
  library: {
    dir: 'lib library src components',
  }
}

/**
 * The Workspace class implements an object which acts as a central repository
 * for your project, providing access to directories, files, configuration files,
 * Javascript libraries and components.
 */
export class Workspace {
  /**
   * Constructor for Workspace object.
   * @param {String} dir - root directory for the workspace
   * @param {Object} [options] - configuration options
   * @param {Object} [options.config] - configuration options for a {@link Config} object
   * @param {Array|String} [options.config.dir] - configuration directory or directories relative to the workspace directory
   * @param {Object} [options.library] - configuration options for a {@link Config} object
   * @param {Array|String} [options.library.dir] - library directory or directories relative to the workspace directory
   * @return {Object} the Workspace object
   */
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

    addDebug(this, options.debug, options.debugPrefix, options.debugColor);
    this.debug('root dir: ', rootDir.path());
    this.debug('config dir: ', cfgDir.path());
    this.debug('libDirs: ', libDirs);
    this.debug('libOpts: ', libOpts);
  }

  /**
   * Fetch a new {@link Directory} object for a sub-directory of the workspace directory.
   * @param {string} path - directory path relative to the workspace directory
   * @param {Object} [options] - directory configuration options
   * @param {String} [options.codec] - codec for encoding/decoding file data
   * @return {Object} a {@link Directory} object
   */
  dir(path, options) {
    this.debug("dir(%s, %o)", path, options);
    return hasValue(path)
      ? this.state.rootDir.dir(path, options)
      : this.state.rootDir;
  }

  /**
   * Fetch a new {@link File} object for a file in the workspace.
   * @param {string} path - file path relative to the workspace directory
   * @param {Object} [options] - file configuration options
   * @param {String} [options.codec] - codec for encoding/decoding file data
   * @param {Boolean} [options.encoding=utf8] - character encoding for the file
   * @return {Object} a {@link File} object
   */
  file(path, options) {
    this.debug("file(%s, %o)", path, options);
    return this.state.rootDir.file(path, options)
  }

  /**
   * Read the content of a file in the workspace.
   * @param {string} path - file path relative to the workspace directory
   * @param {Object} [options] - directory configuration options
   * @param {Boolean} [options.codec] - codec for encoding/decoding file data
   * @param {Boolean} [options.encoding=utf8] - character encoding for the file
   * @return {Promise} fulfills with the file content
   * @example
   * file('myfile.txt').read().then( text => console.log(text) );
   * @example
   * file('myfile.json', { codec: 'json' }).read().then( data => console.log(data) );
   * @example
   * file('myfile.json').read({ codec: 'json' }).then( data => console.log(data) );
   */
  read(path, options) {
    this.debug("read(%s, %o)", path, options);
    return this.file(path, options).read();
  }

  /**
   * Writes content to a file.  If a `codec` has been specified then the content will be encoded.
   * @param {string} path - file path relative to the workspace directory
   * @param {String|Object} data - directory configuration options
   * @param {Object} [options] - directory configuration options
   * @param {Boolean} [options.codec] - codec for encoding/decoding file data
   * @param {Boolean} [options.encoding=utf8] - codec for encoding/decoding file data
   * @return {Promise} fulfills with the file object
   * @example
   * file('myfile.txt').write('Hello World');
   * @example
   * file('myfile.json', { codec: 'json' }).write({ message: 'Hello World' });
   * @example
   * file('myfile.json').write({ message: 'Hello World' }, { codec: 'json' });
   */
  write(path, data, options) {
    this.debug("write(%s, %o, %o)", path, data, options);
    return this.file(path, options).write(data);
  }

  /**
   * Fetch the configuration directory or a directory relative to it
   * @param {string} [path] - file path relative to the configuration directory
   * @param {Object} [options] - directory configuration options
   * @param {String} [options.codec] - codec for encoding/decoding data for files in the directory
   * @param {Boolean} [options.encoding=utf8] - character encoding for files in the directory
   * @return {Object} a {@link Directory} object
   */
  configDir(path, options) {
    this.debug("configDir(%s, %o)", path, options);
    return hasValue(path)
      ? this.state.configDir.dir(path, options)
      : this.state.configDir;
  }

  /**
   * Fetches configuration data from a file in the configuration directory or returns the
   * {@link Config} object itself if no file uri is specified.
   * @param {string} [uri] - file path relative to the configuration directory
   * @param {Object} [defaults] - default configuration options if file isn't found
   * @return {Promise} fulfills to the configuration data read from the file
   * @example
   * workspace.config('myfile').then(
   *   config => console.log("Loaded myfile config: ", config)
   * );
   */
  async config(uri, defaults) {
    this.debug("config(%s, %o)", uri, defaults);
    return hasValue(uri)
      ? this.state.config.config(uri, defaults)
      : this.state.config;
  }

  /**
   * Loads a Javscript library from the library directory or returns the
   * {@link Library} object itself if no file uri is specified.
   * @param {string} [uri] - file path relative to the library directory
   * @return {Promise} fulfills to the configuration data read from the file
   * @example
   * workspace.library('mylib').then(
   *   exports => console.log("Loaded mylib exports: ", exports)
   * );
   */
  async library(uri) {
    this.debug("library(%s, %o)", uri);
    return hasValue(uri)
      ? this.state.library.library(uri)
      : this.state.library;
  }

  /**
   * Loads a Javscript library from the library directory and instantiates a
   * component.
   * @param {String} uri - component base name
   * @param {Object} [props] - optional configuration properties
   * @return {Promise} fulfills to a newly instantiated component
   * @example
   * workspace.component(mycomp').then(
   *   component => console.log("Created component: ", component)
   * );
   */
  async component(uri, props) {
    const [base, fragment] = uri.split('#', 2);
    const config  = await this.config(base, {});
    const lib     = await this.library(config.component?.library || base);
    const exp     = fragment || config.component?.export || 'default';
    const compcls = lib[exp] || fail("No '", exp, "' export from component library: ", uri);
    const comp    = new compcls(this, { ...config, ...props });
    return comp;
  }
}

export const workspace = (dir, options) => new Workspace(dir, options);

export default Workspace;