export * from './Badger/Codecs/index.js';
export * from './Badger/Filesystem/Directory.js';
export * from './Badger/Filesystem/File.js';
export * from './Badger/Filesystem/Path.js';
export * from './Badger/Utils/Misc.js';
export * from './Badger/Utils/Params.js';
export * from './Badger/Utils/Text.js';
export * from './Badger/Workspace.js';

import { } from './Badger/hello.js';
import hello from './Badger/hello.js';

const sayHello = () => {
  console.log(hello);
}

export default sayHello;