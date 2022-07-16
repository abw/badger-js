import { dir } from './Filesystem/Directory.js'
import { fail } from './Utils/Misc.js'
import { allParams, anyParams } from './Utils/Params.js'
import { splitList } from './Utils/Text.js'

const defaults = {
  codecs: 'yaml json',
};

export class Config {
  constructor(params={}) {
    const options = { ...defaults, ...params };
    const [rootDir] = allParams(options, 'dir');
    const [codec, codecs] = anyParams(options, 'codec codecs');

    this.dir    = dir(rootDir);
    this.codecs = splitList(codecs) || [codec];

    // console.log('dir: ', this.dir);
    // console.log('codecs: ', this.codecs);
  }
  file(uri) {
    for (let codec of this.codecs) {
      // const path = this.path(uri, codec);
      const path = uri + '.' + codec;
      const file = this.dir.file(path, { codec });
      if (file.exists()) {
        return file;
      }
    }
    return undefined;
  }
  config(uri) {
    const file = this.file(uri);
    return file
      ? file.read()
      : { };
    //return file.exists().then(
    //  exists => exists
    //    ? file.read()
    //    : fail("Missing configuration file: " + file.path())
    //)
  }
  async configSync(uri) {
    console.log('configSync: ', uri);

    const file = this.file(uri);
    if (! file) {
      console.log('No file');
      return { };
    }
    console.log('got file: ', file);
    const data = file.read();
    console.log('data: ', data);

    return await data;

    return file
      ? await file.read()
      : { };
  }
}

export const config = options => new Config(options)

export default Config
