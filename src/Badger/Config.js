import { dir } from './Filesystem/Directory.js'
import { allParams, anyParams } from './Utils/Params.js'
import { splitList } from './Utils/Text.js'
import { fail } from './Utils/Misc.js';
import { addDebug } from './Utils/Debug.js';

const defaults = {
  codecs: 'yaml json',
};

export class Config {
  constructor(params={}) {
    const options = { ...defaults, ...params };
    const [rootDir] = allParams(options, 'dir');
    const [codec, codecs] = anyParams(options, 'codec codecs');

    this.state = {
      dir:    dir(rootDir),
      codecs: splitList(codecs) || [codec],
    }

    addDebug(this, options.debug, options.debugPrefix, options.debugColor);
    this.debug('root dir: ', this.state.dir.path());
    this.debug('codecs: ', this.state.codecs);
  }
  async file(uri) {
    for (let codec of this.state.codecs) {
      const path = uri + '.' + codec;
      const file = this.state.dir.file(path, { codec });
      this.debug('looking for config file: ', file.path());
      if (await file.exists()) {
        this.debug('config file exists: ', file.path());
        return file;
      }
    }
    return undefined;
  }
  async config(uri, defaults) {
    const file = await this.file(uri);
    return file
      ? await file.read()
      : (defaults || fail("No configuration file for " + uri))
  }
}

export const config = options => new Config(options)

export default Config
