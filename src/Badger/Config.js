import { dir } from './Filesystem/Directory.js'
import { allParams } from './Utils/Params.js'
import { splitList } from './Utils/Text.js'
import { doNothing, fail } from './Utils/Misc.js';
import { addDebug } from './Utils/Debug.js';

const defaults = {
  codecs: 'yaml json',
  jsExt:  'js mjs',
};

export class Config {
  constructor(params={}) {
    const options = { ...defaults, ...params };
    const [rootDir] = allParams(options, 'dir');
    const codecs = options.codecs;
    const jsExt = options.jsExt;

    this.state = {
      dir:    dir(rootDir),
      codecs: splitList(codecs),
      jsExt:  splitList(jsExt),
    }

    addDebug(this, options.debug, options.debugPrefix, options.debugColor);
    this.debug('root dir: ', this.state.dir.path());
    this.debug('codecs: ', this.state.codecs);
  }
  async firstFileWithExt(uri, exts, makeOptions=doNothing) {
    for (let ext of exts) {
      const path = uri + '.' + ext;
      const file = this.state.dir.file(path, makeOptions(uri, ext));
      this.debug('looking for config file: ', file.path());
      if (await file.exists()) {
        this.debug('config file exists: ', file.path());
        return file;
      }
    }
    return undefined;
  }
  async jsFile(uri) {
    return await this.firstFileWithExt(uri, this.state.jsExt);
  }
  async file(uri) {
    return await this.firstFileWithExt(uri, this.state.codecs, (uri, codec) => ({ codec }));
  }
  async config(uri, defaults) {
    // first look for a JS file, e.g. <uri>.js, <uri>.mjs
    const jsFile = await this.jsFile(uri);
    if (jsFile) {
      const load = await import(jsFile.path());
      return load.default;
    }
    // then for a config file with a codec extension, e.g. <uri>.yaml, <uri>.yaml
    const file = await this.file(uri);
    if (file) {
      return await file.read();
    }
    return defaults || fail("No configuration file for " + uri);
  }
}

export const config = options => new Config(options)

export default Config
