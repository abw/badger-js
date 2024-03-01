# Library Modules

The `Library` module is similar to the [`Config`](config-files) module except
that it's designed to work only with Javascript files.

## Library Object

Create a library directory specifying one or more directories where your code
is located. Then call the `library()` method to load a `.js` or `.mjs` module
from any of those directories.

```js
import { Library } from '@abw/badger'

const library = new Library(
  ['src', 'lib']
)

// load first of src/Example.js, src/Example.mjs, lib/Example.js or lib/Example.mjs
library
  .library('Example')
  .then(
    exports => {
      // do something with your code exports here
    }
  )
```

The Promise returned resolves to an object containing all the exports from
your library module.

## Library Directory

When you create a new `Library` object you should specify the name of the
library directory or directories relative to your current location.

```js
const library = new Library('library')
```

You can specify it as a string as shown above, or using a
[`Directory`](filesystem#directories) object as shown in the earlier examples.

For example, if you have a script in the `bin` directory and you want to
load configuration files from the `config` directory located alongside it
then you can do something like this:

```js
import { bin, Library } from '@abw/badger'

const library = new Library(
  bin(import.meta.url).parent().dir('library')
)
```

Or more succinctly like this:

```js
import { bin, Library } from '@abw/badger'

const library = new Library(
  bin(import.meta.url).dir('../library')
)
```
## Multiple Library Directories

If you have multiple locations that you want to read library files
from then you can specify them as an array.  The values of the array can be
either Directory objects or strings, or a mixture of the two.  For example if
you want to load modules from the `src` and `lib` directories then you could
do this:

```js
const rootDir = bin(import.meta.url).parent()

const library = new Library(
  [rootDir.dir('src'), rootDir.dir('lib')]
)
```

## Loading a Library Module

The `library()` method expects the basename (i.e. no file extension) of a
file in your library directory (or one of them).

```js
// load the badger.(js|mjs) file
library
  .library('badger')
  .then(
    badger => {
      // do something with whatever badger exports here
    }
  )
```

It returns a Promise which resolves with all the exports from your module.

## Data Path

If you want to access a particular export then you can specify it as a data path
fragment following the file name.  Separate the file name and data path fragment
with a `#`.

```js
// load the default export from the badger.(js|mjs) file
library
  .library('badger#default')
  .then(
    badger => {
      // do something with the default badger export here
    }
  )
```

See the [Data Paths](data-paths) documentation for further information.

## Configuration Options

The `jsExt` configuration option can be used to change the file extensions
that are recognised for Javascript files (`['js', 'mjs']` by default).

For example, if you only want to look for `.js` Javascript files and `.json`
data files then you would set the options like this:

```js
const libary = new Library(
  rootDir.dir('lib'),
  {
    jsExt:  ['js'],
  };
)
```

Or, given that you now only have one value for `jsExt` you
could do it like this:

```js
const library = new Library(
  rootDir.dir('lib'),
  {
    jsExt:  'js',
  };
)
```
