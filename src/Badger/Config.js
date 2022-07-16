import { dir, fail, allParams, anyParams } from '../Badger.js'

const defaults = {
  codecs: 'yaml json',
};

class Config {
  constructor(params={}) {
    const options = { ...defaults, ...params };
    const [rootDir] = allParams(options, 'dir');
    const [codec, codecs] = anyParams(options, 'codec codecs');

    this.dir    = dir(root);
    this.codecs = codecs || [codec];

    console.log('dir: ', this.dir);
    console.log('codecs: ', this.codecs.dir);

  }
  path(uri) {
    return uri.toLowerCase() + '.' + this.codec;
  }
  file(uri) {
    return this.root.file(this.path(uri));
  }
  exists(uri) {
    return this.file(uri).exists();
  }
  config(uri) {
    const file = this.file(uri);
    return file.exists().then(
      exists => exists
        ? file.read()
        : fail("Missing configuration file: " + file.path())
    )
  }
}

export default Config
