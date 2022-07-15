import json from './Json.js'
import yaml from './Yaml.js'

// Codecs provide a consistent encode()/decode() interface for serialising
// and de-serialising data.  This standard naming convention makes it possible
// for the ../Filesystem/File.js module to support a "codec" option for
// files. When this option is set the file.read() and file.write() methods
// automatically handle the translation to and from the serialised format
// using a codec object returned by the codec() function below.  The codec
// name can be specified in any case, e.g. "Yaml", "YAML", "yaml", "YaML",
// etc., and it will be converted to lower case.

export const codecs = {
  json, yaml
};

export const codec = name => codecs[
  name.toLowerCase()
];

export default codecs
